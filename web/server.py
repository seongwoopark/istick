from sanic import Sanic
from receiver.receiver import listen

app = Sanic()


@app.websocket("/")
# @app.route("/")
async def feed(request):
    while True:
        # # from front-end
        # data = await ws.recv()
        # print(f"Received: {data}")

        # from back-end to front-end
        # await ws.send(data)
        data = next(listen())
        print(f"Sent: {data}")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
