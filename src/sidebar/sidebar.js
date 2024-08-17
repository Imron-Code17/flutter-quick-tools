function getWebviewContent() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tabbed Interface</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; box-sizing: border-box; background-color: #181818; font-size: 10px; color: rgba(221, 221, 221, 0.5); }
        .container { display: flex; height: 100vh; }
        .left { width: 75%; background-color: #181818; position: relative; display: flex; flex-direction: column; }
        .right { flex: 1; background-color: #202020; padding: 20px; }
        .tab-container { width: 100%; position: relative; }
        .tabs { display: flex; border-bottom: .2px solid rgba(221, 221, 221, 0.3); position: relative; }
        .tab { flex: 1; padding: 10px; text-align: center; cursor: pointer; background-color: #181818; border: none; color: rgba(221, 221, 221, 0.5); }
        .tab.active { background-color: #181818; font-size: 10px; font-weight: 600; color: white; }
        .tab-content { padding: 20px; border-top: none; background-color: #181818; margin-left: 5px; }
        .content { display: none; }
        .content.active { display: block; }
        .indicator { height: 2px; background-color: #10439F; position: absolute; bottom: 0; transition: all 0.3s ease; width: 0; left: 0; }
        .tab-container::after { content: ''; position: absolute; top: 0; right: 0; width: 1px; background-color: rgba(221, 221, 221, 0.3); }
    </style>
</head>
<body>
    <div class="container">
        <div class="left">
            <div class="tab-container">
                <div class="tabs">
                    <div class="tab" id="tab-model">Model</div>
                    <div class="tab" id="tab-view">View</div>
                    <div class="tab" id="tab-endpoint">Endpoint</div>
                    <div class="tab" id="tab-feature">Feature</div>
                    <div class="indicator"></div>
                </div>
                <div class="tab-content">
                    <div class="content" id="content-model"><h2>Model Tab</h2><p>Content for the Model tab.</p></div>
                    <div class="content" id="content-view"><h2>View Tab</h2><p>Content for the View tab.</p></div>
                    <div class="content" id="content-endpoint"><h2>Endpoint Tab</h2><p>Content for the Endpoint tab.</p></div>
                    <div class="content" id="content-feature"><h2>Feature Tab</h2><p>Content for the Feature tab.</p></div>
                </div>
            </div>
        </div>
        <div class="right">
            <h2>Right Area</h2>
            <p>Content for the right side.</p>
        </div>
    </div>
</body>
</html>`;
}


module.exports = {
    getWebviewContent
}