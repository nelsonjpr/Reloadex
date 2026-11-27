package com.reloadex.pokedex;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    // El back físico se delega a la UI (src/App.jsx), que conserva su propia
    // pila de pantallas. Nunca se llama a super.onBackPressed(): la app no se
    // cierra ni se minimiza desde el botón del móvil.
    private static final String BACK_HANDLER_JS =
        "(function(){try{return typeof window.__reloadexOnAndroidBack === 'function'"
        + " && !!window.__reloadexOnAndroidBack();}catch(e){return false;}})()";

    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Capacitor exige registrar los plugins antes de crear el bridge.
        registerPlugin(UpdaterPlugin.class);
        super.onCreate(savedInstanceState);
    }

    @Override
    @SuppressWarnings("deprecation")
    public void onBackPressed() {
        if (bridge != null && bridge.getWebView() != null) {
            bridge.getWebView().evaluateJavascript(BACK_HANDLER_JS, null);
        }
    }
}
