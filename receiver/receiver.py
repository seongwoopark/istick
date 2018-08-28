import serial

ser = serial.Serial('/dev/cu.usbmodem142411', 9600)
joystick = {
    'DIR': '·', 'X': b'0', 'Y': b'0', 'A': b'0', 'B': b'0', 'C': b'0', 'D': b'0'
}
dir_chars = [
    '↖', '↑', '↗',
    '←', '·', '→',
    '↙', '↓', '↘',
]
dirs = {
    ('L', 'U'): '↖',
    ('C', 'U'): '↑',
    ('R', 'U'): '↗',
    ('L', 'C'): '←',
    ('C', 'C'): '·',
    ('R', 'C'): '→',
    ('L', 'D'): '↙',
    ('C', 'D'): '↓',
    ('R', 'D'): '↘',
}


def get_x_axis_dir(x):
    # x range: 1023 ~ 480 ~ 0
    if x > 490:
        return 'L'
    elif x < 470:
        return 'R'
    return 'C'


def get_y_axis_dir(y):
    # y range: 0 ~ 490 ~ 1023
    if y > 500:
        return 'U'
    elif y < 480:
        return 'D'
    return 'C'


key = None
value = None
while True:
    input_raw = ser.read_until()[:-1]
    decoded = input_raw.decode("utf-8")
    if decoded in joystick:
        key = decoded
        value = None
    else:
        value = input_raw

    if key and value:
        # raw joystick values
        joystick[key] = value

        # type case
        joystick['X'] = int(joystick['X'])
        joystick['Y'] = int(joystick['Y'])

        # decide direction
        x_dir = get_x_axis_dir(joystick['X'])
        y_dir = get_y_axis_dir(joystick['Y'])
        joystick['DIR'] = dirs.get((x_dir, y_dir), '·')
        print(joystick)
