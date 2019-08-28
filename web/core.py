import asyncio
import json
import time
from sanic import Sanic
from receiver import receiver

app = Sanic()


def consume_garbage_data(*args, **kwargs):
    for _ in range(200):
        try:
            data = next(receiver.listen())
        except Exception:
            continue


app.listeners['before_server_start'].append(consume_garbage_data)


combination = ['←', '↙', '↓', '↘', '→', 'A', 'B']
queue_init_sec = 1.0
key_interval_sec = 0.3
loop_interval = 0.002


@app.websocket("/")
async def feed(request, ws):
# @app.route("/")
# async def feed(request):
    # init
    print(f"Websocket opened, {ws}")
    data = {'input': [], 'success': False}
    prev_input_key = '-1'
    prev_input_key_time = -1

    # listen
    while True:
        # # from front-end
        # TODO: receive key combinations
        # data = await ws.recv()
        # print(f"Received: {data}")

        # from receiver(arduino)
        await asyncio.sleep(loop_interval)
        try:
            joystick_data = next(receiver.listen())
        except Exception:
            continue
        epoch_now = time.time()

        # get input_key
        input_key = ''
        if joystick_data['DIR'] != '·':
            input_key += joystick_data['DIR']
        if not bool(joystick_data['A']):
            input_key += 'A'
        if not bool(joystick_data['B']):
            input_key += 'B'
        if not bool(joystick_data['C']):
            input_key += 'C'
        if not bool(joystick_data['D']):
            input_key += 'D'

        # append input key
        if input_key and (epoch_now - prev_input_key_time > key_interval_sec or prev_input_key != input_key):
            data['input'].append(input_key)
            prev_input_key = input_key
            prev_input_key_time = epoch_now

        # to front-end
        if data['input']:
            await ws.send(json.dumps(data))
            print(f"Sent: {data['input']}")

        # check input queue
        if prev_input_key_time != -1 and epoch_now - prev_input_key_time > queue_init_sec:
            if data['input'] == combination:
                print("Deploy!!")
                data['success'] = True
                await ws.send(json.dumps(data))
                print(f"Sent: {data['success']}")
                # TODO: if did, send success signal to jenkins
                break
            else:
                data = {'input': [], 'success': False}
                prev_input_key = '-1'
                prev_input_key_time = -1
                print('init')
