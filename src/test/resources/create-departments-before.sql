delete from teachers;
delete from department;

insert into department(id, name) values
(1, 'Department1'),
(2, 'Department2'),
(3, 'Department3');

insert into teachers(id, name, patronymic, position, surname, department_id)
values (1, 'Ivan', 'Ivanovych', 'docent', 'Ivanov', 1),
       (2, 'Stepan', 'Stepanovych', 'docent', 'Ivanov', 2);