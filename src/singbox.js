import GLib from 'gi://GLib';
import Gio from 'gi://Gio';


export const disconnect = () => { }

export const connect = () => {
  // TODO: Run `sudo singbox -c $HOME/.config/shuttle.josn` in background
  // TODO: Then run `sudo ip route add default via 172.23.0.1`
}

export const saveConfig = async (server, port) => {
  console.log(":SAVE")
  const singBoxConfig = {
    "inbounds": [
      {
        "type": "tun",
        "tag": "tun-in",
        "interface_name": "tun0",
        "address": [
          "172.23.0.1/30",
          "fdfe:dcba:9876::1/126"
        ],
        "mtu": 9000,
        "auto_route": true,
        "iproute2_table_index": 2022,
        "iproute2_rule_index": 9000,
        "auto_redirect": true,
        "auto_redirect_input_mark": "0x2023",
        "auto_redirect_output_mark": "0x2024",
        "loopback_address": [
          "10.7.0.1"
        ],
        "strict_route": true,
        "route_address": [
          "0.0.0.0/1",
          "128.0.0.0/1",
          "::/1",
          "8000::/1"
        ],
        "route_exclude_address": [
          "192.168.0.0/16",
          "fc00::/7"
        ],
        "endpoint_independent_nat": false,
        "udp_timeout": "5m",
        "stack": "system",
        "include_interface": [
          "lan0"
        ],
        "exclude_interface": [
          "lan1"
        ],
        "include_uid": [
          0
        ],
        "include_uid_range": [
          "1000:99999"
        ],
        "exclude_uid": [
          1000
        ],
        "exclude_uid_range": [
          "1000:99999"
        ],
        "include_android_user": [
          0,
          10
        ],
        "include_package": [
          "com.android.chrome"
        ],
        "exclude_package": [
          "com.android.captiveportallogin"
        ],
      }
    ],
    "outbounds": [
      {
        "type": "socks",
        "tag": "proxy",
        "server": server,
        "server_port": port
      }
    ],
    "route": {
      "rules": [
        {
          "ip_is_private": true,
          "outbound": "direct"
        }
      ],
      "final": "proxy",
      "auto_detect_interface": true
    }
  }
  console.log(singBoxConfig)
  try {
    const filepath = GLib.build_filenamev([GLib.get_home_dir(), '.config/shuttle.json']);
    console.log(filepath)
    const file = Gio.File.new_for_path(filepath);

    const bytes = new GLib.Bytes(JSON.stringify(singBoxConfig));

    await file.replace_contents_bytes_async(bytes, null, false,
      Gio.FileCreateFlags.REPLACE_DESTINATION, null, (obj, res, data) => {

      });
  } catch (e) {
    console.log(e)
  }
}

export const getServerAndPort = async () => {
  try {
    const filepath = GLib.build_filenamev([GLib.get_home_dir(), '.config/shuttle.json']);
    const file = Gio.File.new_for_path(filepath);

    const [ok, contents, etag] = file.load_contents(null);

    const decoder = new TextDecoder('utf-8');
    const contentsString = decoder.decode(contents);

    const config = JSON.parse(contentsString)

    return [config['outbounds'][0]['server'], config['outbounds'][0]['server_port']];
  } catch (e) {
    console.log(e)
  }
}
