package com.besafx.app;

import com.besafx.app.service.ReceiptService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
public class MainTests {

    private final Logger log = LoggerFactory.getLogger(MainTests.class);


    @Autowired
    private ReceiptService receiptService;

    @Test
    public void contextLoads() throws Exception {

    }
}
