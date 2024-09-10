import wifi from 'node-wifi'

wifi.init({
    iface:null,
});



export const GetWifi = async (req, res) => {
    try {
        const wifiData = await new Promise((resolve, reject) => {
            wifi.getCurrentConnections((error, currentConnections) => {
                if (error) {
                    console.error(error);
                    reject(error);
                } else {
                    if (currentConnections.length > 0) {
                        const connections = currentConnections.map(conexion => ({
                            wifi_name: conexion.bssid,
                            security_type: conexion.security_flags
                        }));
                        resolve(connections);
                    } else {
                        resolve(null);
                    }
                }
            });
        });

        if (wifiData) {
            res.json(wifiData);
        } else {
            res.status(404).json({ message: "No hay red conectada" });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
};
