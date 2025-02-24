package br.com.arrowdata.generic.service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class GenericService {

    Logger logger = LoggerFactory.getLogger(GenericService.class);

    public Map<String, String> setCommand(String strCommand) throws Exception {

        String[] command = null;
        Map<String, String> result = new HashMap<>();        

        if(System.getProperty("os.name").toLowerCase().contains("windows")) {
            command = new String[]{"cmd.exe", "/c", strCommand};
        }else{
            command = new String[]{"sh", "-c", strCommand};
        }      

        ProcessBuilder processBuilder = new ProcessBuilder(command);
        processBuilder.redirectErrorStream(true);
        Process process = processBuilder.start();

        BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
        String line = "";
        String str = "";
        
        while((line = reader.readLine()) != null) {
            str += line+"\n";
        }
        
        result.put("output", str);
        process.waitFor();

        return result;
    }
}
