/* window.js
 *
 * Copyright 2025 Hadi
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';
import * as SG from './singbox.js';
import Adw from 'gi://Adw';

export const ShuttleWindow = GObject.registerClass({
    GTypeName: 'ShuttleWindow',
    Template: 'resource:///ir/hipoo/Shuttle/window.ui',
    InternalChildren: ['connection_switch', 'host_entry', 'port'],
}, class ShuttleWindow extends Adw.ApplicationWindow {
    constructor(application) {
        super({ application });

        SG.getServerAndPort().then(([srv, p]) => {
          console.log(srv, p);
          this._host_entry.set_text(srv);
          this._port.set_value(p);
        })

        this._connection_switch.connect('notify::active', async c_switch => {
          const state = !c_switch.get_state();
          const server = this._host_entry.get_text();
          const port = this._port.get_value();

          if (state) {
            console.log("THAT")
            SG.disconnect()
          } else {
            await SG.saveConfig(server, 10100);
            await SG.connect();
          }
        })
    }
});

