package ir.abolfazl.anjam;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(android.os.Bundle savedInstanceState) {
        registerPlugin(ServerConfigPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
