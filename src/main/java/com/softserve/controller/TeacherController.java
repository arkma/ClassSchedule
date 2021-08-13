package com.softserve.controller;

import com.softserve.dto.TeacherDTO;
import com.softserve.dto.TeacherForUpdateDTO;
import com.softserve.dto.TeacherWishDTO;
import com.softserve.entity.Teacher;
import com.softserve.entity.User;
import com.softserve.entity.enums.Role;
import com.softserve.mapper.TeacherMapper;
import com.softserve.service.ScheduleService;
import com.softserve.service.TeacherService;
import com.softserve.service.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@Api(tags = "Teacher API")
@Slf4j
public class TeacherController {
    private final TeacherService teacherService;
    private final TeacherMapper teacherMapper;
    private final UserService userService;
    private final ScheduleService scheduleService;

    @Autowired
    public TeacherController(TeacherService teacherService, TeacherMapper teacherMapper, UserService userService, ScheduleService scheduleService) {
        this.teacherService = teacherService;
        this.teacherMapper = teacherMapper;
        this.userService = userService;
        this.scheduleService = scheduleService;
    }

    @GetMapping(path = {"/teachers", "/public/teachers"})
    @ApiOperation(value = "Get the list of all teachers")
    public ResponseEntity<List<TeacherDTO>> getAll() {
        log.info("Enter into list method");
        return ResponseEntity.ok(teacherMapper.teachersToTeacherDTOs(teacherService.getAll()));
    }

    @GetMapping("/teachers/{id}")
    @ApiOperation(value = "Get teacher by id")
    public ResponseEntity<TeacherDTO> get(@PathVariable("id") Long id) {
        log.info("Enter into get method with id {} ", id);
        Teacher teacher = teacherService.getById(id);
        return ResponseEntity.ok().body(teacherMapper.teacherToTeacherDTO(teacher));
    }

    @GetMapping("/teachers/with-wishes")
    @ApiOperation(value = "Get the list of all teachers with wishes")
    public ResponseEntity<List<TeacherWishDTO>> getAllWithWishes() {
        log.info("Enter into getAllWithWishes method");
        return ResponseEntity.ok(teacherMapper.toTeacherWithWishesDTOs(teacherService.getAllTeachersWithWishes()));
    }

    @GetMapping("/teachers/{id}/with-wishes")
    @ApiOperation(value = "Get teacher with wish by id")
    public ResponseEntity<TeacherWishDTO> getTeacherWithWishes(@PathVariable("id") Long id) {
        log.info("Enter into getTeacherWithWishes method with id {} ", id);
        Teacher teacher = teacherService.getTeacherWithWishes(id);
        return ResponseEntity.ok().body(teacherMapper.toTeacherWithWishesDTOs(teacher));
    }

    @PostMapping("/teachers")
    @ApiOperation(value = "Create new teacher")
    public ResponseEntity<TeacherDTO> save(@RequestBody TeacherDTO teacherDTO) {
        log.info("Enter into save method with teacherDTO: {}", teacherDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(teacherMapper.teacherToTeacherDTO(teacherService.save(teacherDTO)));
    }

    @PutMapping("/teachers")
    @ApiOperation(value = "Update existing teacher by id")
    public ResponseEntity<TeacherForUpdateDTO> update(@RequestBody TeacherForUpdateDTO teacherForUpdateDTO) {
        log.info("Enter into update method with updateTeacherDTO: {}", teacherForUpdateDTO);
        return ResponseEntity.status(HttpStatus.OK)
                .body(teacherMapper.teacherToTeacherForUpdateDTO(teacherService.update(teacherForUpdateDTO)));
    }

    @DeleteMapping("/teachers/{id}")
    @ApiOperation(value = "Delete teacher by id")
    public ResponseEntity delete(@PathVariable("id") Long id) {
        log.info("Enter into delete method with  teacher id: {}", id);
        Teacher teacher = teacherService.getById(id);
        if (teacher.getUserId() != null) {
            User user = userService.getById(teacher.getUserId().longValue());
            user.setRole(Role.ROLE_USER);
            userService.update(user);
        }
        teacherService.delete(teacher);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping("/teachers/disabled")
    @ApiOperation(value = "Get the list of disabled teachers")
    public ResponseEntity<List<TeacherDTO>> getDisabled() {
        log.info("Enter into getDisabled");
        return ResponseEntity.ok(teacherMapper.teachersToTeacherDTOs(teacherService.getDisabled()));
    }

    @GetMapping("/not-registered-teachers")
    @ApiOperation(value = "Get the list of all teachers, that don't registered in system")
    public ResponseEntity<List<TeacherDTO>> getAllNotRegisteredTeachers() {
        log.info("Enter into getAllNotRegisteredTeachers method");
        return ResponseEntity.ok(teacherMapper.teachersToTeacherDTOs(teacherService.getAllTeacherWithoutUser()));
    }

    @GetMapping("/send-pdf-to-email/semester/{id}")
    @ApiOperation(value = "Send pdf with schedule to teachers emails")
    public ResponseEntity sendSchedulesToEmail(@PathVariable("id") Long semesterId, @RequestParam Long[] teachersId) {
        log.info("Enter into sendPDFToEmail method with teachers id: {} and semester id: {}", teachersId, semesterId);
        scheduleService.sendScheduleToTeachers(semesterId, teachersId);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}