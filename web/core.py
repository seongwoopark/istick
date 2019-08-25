import json
import time
from sanic import Sanic
from receiver import receiver

app = Sanic()


combination = ['←', '↙', '↓', '↘', '→', 'A', 'A']
queue_init_sec = 1.0
key_interval_sec = 0.3


@app.websocket("/")
async def feed(request, ws):
# @app.route("/")
# async def feed(request):
    # init
    input_queue = []
    prev_input_key = '-1'
    prev_input_key_time = -1

    # listen
    while True:
        # # from front-end
        # TODO: receive key combinations
        # data = await ws.recv()
        # print(f"Received: {data}")

        # from receiver(arduino)
        try:
            data = next(receiver.listen())
        except Exception:
            pass
        epoch_now = time.time()

        # get input_key
        input_key = ''
        if data['DIR'] != '·':
            input_key += data['DIR']
        if not bool(data['A']):
            input_key += 'A'
        if not bool(data['B']):
            input_key += 'B'
        if not bool(data['C']):
            input_key += 'C'
        if not bool(data['D']):
            input_key += 'D'

        # append input key
        if input_key and (epoch_now - prev_input_key_time > key_interval_sec or prev_input_key != input_key):
            input_queue.append(input_key)
            prev_input_key = input_key
            prev_input_key_time = epoch_now

        # to front-end
        if input_queue:
            await ws.send(json.dumps(input_queue))
            print(f"Sent: {input_queue}")

        # check input queue
        if prev_input_key_time != -1 and epoch_now - prev_input_key_time > queue_init_sec:
            if input_queue == combination:
                print("Deploy!!")
                # TODO: if did, send success signal to FE and jenkins
                break
            else:
                input_queue = []
                prev_input_key = '-1'
                prev_input_key_time = -1
                print('init')
