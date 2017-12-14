package com.besafx.app.rest;

import com.besafx.app.config.DropboxManager;
import com.besafx.app.entity.Attach;
import com.besafx.app.entity.ContractAttach;
import com.besafx.app.service.AttachService;
import com.besafx.app.service.ContractAttachService;
import com.besafx.app.service.ContractService;
import com.besafx.app.service.PersonService;
import com.besafx.app.ws.Notification;
import com.besafx.app.ws.NotificationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.bohnman.squiggly.Squiggly;
import com.github.bohnman.squiggly.util.SquigglyUtils;
import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

@RestController
@RequestMapping(value = "/api/contractAttach/")
public class ContractAttachRest {

    public static final String FILTER_TABLE = "id,contract[id],attach[**,person[id,nickname,name]]";
    private final static Logger log = LoggerFactory.getLogger(ContractAttachRest.class);
    @Autowired
    private PersonService personService;

    @Autowired
    private ContractService contractService;

    @Autowired
    private ContractAttachService contractAttachService;

    @Autowired
    private AttachService attachService;

    @Autowired
    private DropboxManager dropboxManager;

    @Autowired
    private NotificationService notificationService;

    @RequestMapping(value = "upload", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @PreAuthorize("hasRole('ROLE_CONTRACT_CREATE')")
    public String upload(@RequestParam(value = "contractId") Long contractId,
                         @RequestParam(value = "fileName") String fileName,
                         @RequestParam(value = "mimeType") String mimeType,
                         @RequestParam(value = "description") String description,
                         @RequestParam(value = "remote") Boolean remote,
                         @RequestParam(value = "file") MultipartFile file,
                         Principal principal)
            throws ExecutionException, InterruptedException, IOException {

        ContractAttach contractAttach = new ContractAttach();
        contractAttach.setContract(contractService.findOne(contractId));

        Attach attach = new Attach();
        attach.setName(fileName);
        attach.setMimeType(mimeType);
        attach.setDescription(description);
        attach.setSize(file.getSize());
        attach.setDate(new DateTime().toDate());
        attach.setRemote(remote);
        attach.setPerson(personService.findByEmail(principal.getName()));

        String path = "/AQSAT/Contracts/" + contractId + "/" + fileName + "." + mimeType;

        Future<Boolean> uploadTask = dropboxManager.uploadFile(file, path);
        if (uploadTask.get()) {
            Future<String> shareTask = dropboxManager.shareFile(path);
            attach.setLink(shareTask.get());
            attach = attachService.save(attach);
            contractAttach.setAttach(attach);
            notificationService.notifyOne(Notification.builder().message("تم رفع الملف" + " [ " + file.getOriginalFilename() + " ] " + " بنجاح.").type("success").build(), principal.getName());
            return SquigglyUtils.stringify(Squiggly.init(new ObjectMapper(), FILTER_TABLE), contractAttachService.save(contractAttach));
        }else{
            return null;
        }
    }

    @RequestMapping(value = "delete/{id}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @PreAuthorize("hasRole('ROLE_CONTRACT_DELETE')")
    public Boolean delete(@PathVariable Long id, Principal principal) throws ExecutionException, InterruptedException {
        ContractAttach contractAttach = contractAttachService.findOne(id);
        if (contractAttach != null) {
            Future<Boolean> deleteTask = dropboxManager.deleteFile("/AQSAT/Contracts/" + contractAttach.getContract().getId() + "/" + contractAttach.getAttach().getName() + "." + contractAttach.getAttach().getMimeType());
            if (deleteTask.get()) {
                contractAttachService.delete(contractAttach);
                notificationService.notifyOne(Notification.builder().message("تم حذف الملف" + " [ " + contractAttach.getAttach().getName() + " ] " + " بنجاح.").type("success").build(), principal.getName());
                return true;
            } else {
                notificationService.notifyOne(Notification.builder().message("لا يمكن حذف الملف" + " [ " + contractAttach.getAttach().getName() + " ] ").type("error").build(), principal.getName());
                return false;
            }
        }else{
            return false;
        }
    }

    @RequestMapping(value = "deleteWhatever/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    @PreAuthorize("hasRole('ROLE_CONTRACT_DELETE')")
    public void deleteWhatever(@PathVariable Long id, Principal principal) throws ExecutionException, InterruptedException {
        ContractAttach contractAttach = contractAttachService.findOne(id);
        if (contractAttach != null) {
            contractAttachService.delete(contractAttach);
            notificationService.notifyOne(Notification.builder().message("تم حذف المرفق" + " [ " + contractAttach.getAttach().getName() + " ] " + " بنجاح.").type("success").build(), principal.getName());
        }
    }

    @RequestMapping(value = "findByContract/{contractId}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String findByContract(@PathVariable(value = "contractId") Long contractId) {
        return SquigglyUtils.stringify(Squiggly.init(new ObjectMapper(), FILTER_TABLE), contractAttachService.findByContractId(contractId));
    }
}
