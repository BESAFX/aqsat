package com.besafx.app.rest;

import com.besafx.app.entity.Person;
import com.besafx.app.service.PersonService;
import com.besafx.app.util.JSONConverter;
import com.besafx.app.util.Options;
import com.besafx.app.ws.Notification;
import com.besafx.app.ws.NotificationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.bohnman.squiggly.Squiggly;
import com.github.bohnman.squiggly.util.SquigglyUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping(value = "/api/person/")
public class PersonRest {

    private final static Logger log = LoggerFactory.getLogger(PersonRest.class);

    public static final String FILTER_TABLE = "**,-hiddenPassword,team[**,-persons]";

    @Autowired
    private PersonService personService;

    @Autowired
    private NotificationService notificationService;

    @RequestMapping(value = "update", method = RequestMethod.PUT, consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @PreAuthorize("hasRole('ROLE_PROFILE_UPDATE')")
    public String update(@RequestBody Person person, Principal principal) {
        Person object = personService.findByEmail(principal.getName());
        if (object != null) {
            person.setTokenExpired(false);
            person.setActive(false);
            log.info("حفظ الحساب الشخصي...");
            person = personService.save(person);
            Person caller = personService.findByEmail(principal.getName());
            String lang = JSONConverter.toObject(caller.getOptions(), Options.class).getLang();
            notificationService.notifyOne(Notification.builder().message(lang.equals("AR") ? "تم تعديل البيانات بنجاح" : "Update Account Information Successfully").type("warning").build(), principal.getName());
            return SquigglyUtils.stringify(Squiggly.init(new ObjectMapper(), FILTER_TABLE), person);
        } else {
            return null;
        }
    }

    @RequestMapping(value = "setGUILang/{lang}", method = RequestMethod.GET)
    @ResponseBody
    @PreAuthorize("hasRole('ROLE_PROFILE_UPDATE')")
    public void setGUILang(@PathVariable(value = "lang") String lang, Principal principal) {
        Person person = personService.findByEmail(principal.getName());
        Options options = JSONConverter.toObject(person.getOptions(), Options.class);
        options.setLang(lang);
        person.setOptions(JSONConverter.toString(options));
        personService.save(person);
    }

    @RequestMapping(value = "setDateType/{type}", method = RequestMethod.GET)
    @ResponseBody
    @PreAuthorize("hasRole('ROLE_PROFILE_UPDATE')")
    public void setDateType(@PathVariable(value = "type") String type, Principal principal) {
        Person person = personService.findByEmail(principal.getName());
        Options options = JSONConverter.toObject(person.getOptions(), Options.class);
        options.setDateType(type);
        person.setOptions(JSONConverter.toString(options));
        personService.save(person);
    }

    @RequestMapping("findActivePerson")
    @ResponseBody
    public String findActivePerson(Principal principal) {
        return SquigglyUtils.stringify(Squiggly.init(new ObjectMapper(), FILTER_TABLE), personService.findByEmail(principal.getName()));
    }

}
