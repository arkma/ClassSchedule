import { get } from 'lodash';
import { daysUppercase } from '../constants/schedule/days';

const sortStrings = (a, b) => {
    if (a > b) return 1;
    if (b > a) return -1;
    return 0;
};

export const makeGroupSchedule = (groupSchedule) => {
    const evenArray = [];
    const oddArray = [];
    let group = {};
    let done = false;

    const evenDaysPrepArray = [
        { day: 'MONDAY', class: [] },
        { day: 'TUESDAY', class: [] },
        { day: 'WEDNESDAY', class: [] },
        { day: 'THURSDAY', class: [] },
        { day: 'FRIDAY', class: [] },
        { day: 'SATURDAY', class: [] },
        { day: 'SUNDAY', class: [] },
    ];
    const oddDaysPrepArray = [
        { day: 'MONDAY', class: [] },
        { day: 'TUESDAY', class: [] },
        { day: 'WEDNESDAY', class: [] },
        { day: 'THURSDAY', class: [] },
        { day: 'FRIDAY', class: [] },
        { day: 'SATURDAY', class: [] },
        { day: 'SUNDAY', class: [] },
    ];

    if (groupSchedule.schedule && groupSchedule.schedule.length > 0) {
        const { group: groupData } = groupSchedule.schedule[0];
        group = groupData;
        groupSchedule.schedule[0].days.forEach((day) => {
            day.classes.forEach((classItem) => {
                evenDaysPrepArray.forEach((evenDayPrep) => {
                    if (evenDayPrep.day === day.day) {
                        evenDayPrep.class[classItem.class.id] = {
                            class: classItem.class,
                            card: classItem.weeks.even,
                        };
                    }
                });

                oddDaysPrepArray.forEach((oddDayPrep) => {
                    if (oddDayPrep.day === day.day) {
                        oddDayPrep.class[classItem.class.id] = {
                            class: classItem.class,
                            card: classItem.weeks.odd,
                        };
                    }
                });
            });
        });
    }

    oddDaysPrepArray.forEach((oddDay) => {
        oddDay.class.forEach((oddClas, clasIndex) => {
            if (!get(oddArray, clasIndex)) {
                oddArray[clasIndex] = { class: oddClas.class, cards: {} };
            }

            daysUppercase.forEach((dayArr) => {
                if (!get(oddArray[clasIndex].cards, dayArr)) {
                    oddArray[clasIndex].cards[dayArr] = {};
                }
            });
            if (oddClas.card !== null && oddClas.card !== undefined) {
                if (get(oddClas.card, 'teacher')) {
                    oddArray[clasIndex].cards[oddDay.day] = {
                        card: oddClas.card,
                    };
                }
            }
        });
    });

    evenDaysPrepArray.forEach((evenDay) => {
        evenDay.class.forEach((evenClas, clasIndex) => {
            if (!get(evenArray, clasIndex)) {
                evenArray[clasIndex] = { class: evenClas.class, cards: {} };
            }

            daysUppercase.forEach((dayArr) => {
                if (!get(evenArray[clasIndex].cards, dayArr)) {
                    evenArray[clasIndex].cards[dayArr] = {};
                }
            });
            if (evenClas.card !== null && evenClas.card !== undefined) {
                if (get(evenClas.card, 'teacher')) {
                    evenArray[clasIndex].cards[evenDay.day] = {
                        card: evenClas.card,
                    };
                }
            }
        });
    });
    done = true;
    return {
        semester: groupSchedule.semester,
        oddArray,
        evenArray,
        group,
        done,
    };
};

export const makeFullSchedule = (fullSchedule) => {
    let groupsCount = 0;
    let groupList = [];
    const groupListId = new Map([]);
    const daysPrepArrayFull = [];
    let done = false;
    let semesterDays = [];
    let semesterClasses = [];

    if (fullSchedule.schedule) {
        groupsCount = fullSchedule.schedule.length;
        semesterDays = fullSchedule.semester.semester_days;
        semesterClasses = fullSchedule.semester.semester_classes;

        fullSchedule.schedule.forEach((group) => {
            groupList.push(group.group);
            groupListId.set(group.group.id, {});
        });
        groupList = groupList.sort((a, b) => sortStrings(a.title, b.title));

        fullSchedule.semester.semester_days.forEach((day) => {
            const prepScheduleArray = [];
            fullSchedule.semester.semester_classes.forEach((classItem) => {
                const oddArray = [];
                const evenArray = [];
                groupList.forEach((groupItem) => {
                    const groupFull = fullSchedule.schedule.find(
                        (groupFullIterate) => groupFullIterate.group.id === groupItem.id,
                    );
                    const dayFull = groupFull.days.find(
                        (dayFullIterate) => dayFullIterate.day === day,
                    );
                    const classFull = dayFull.classes.find(
                        (dayFullIterable) => dayFullIterable.class.id === classItem.id,
                    );
                    oddArray.push({
                        group: groupItem,
                        card: classFull.weeks.odd,
                    });
                    evenArray.push({
                        group: groupItem,
                        card: classFull.weeks.even,
                    });
                });
                prepScheduleArray.push({
                    class: classItem,
                    cards: { odd: oddArray, even: evenArray },
                });
            });
            daysPrepArrayFull.push({ day, classes: prepScheduleArray });
        });
        done = true;
    }

    return {
        semester: fullSchedule.semester,
        schedule: fullSchedule.schedule,
        semesterClasses,
        semesterDays,
        groupsCount,
        groupList,
        resultArray: daysPrepArrayFull,
        done,
    };
};

export const makeTeacherSchedule = (teacherSchedule) => {
    let teacher = {};
    const evenArray = [];
    const oddArray = [];
    const oddDays = [];
    const evenDays = [];
    const oddClasses = [];
    const evenClasses = [];
    let done = false;

    if (teacherSchedule && teacherSchedule.days) {
        const { teacher: teacherData } = teacherSchedule;
        teacher = teacherData;

        teacherSchedule.days.forEach((dayTeacher) => {
            dayTeacher.odd.classes.forEach((clas) => {
                if (oddClasses.findIndex((oddClass) => oddClass.id === clas.class.id) < 0) {
                    oddClasses.push(clas.class);
                }
                if (oddDays.indexOf(dayTeacher.day) < 0) {
                    oddDays.push(dayTeacher.day);
                }
                if (!(clas.class.id in oddArray)) {
                    oddArray[clas.class.id] = [];
                }

                oddArray[clas.class.id].push({
                    day: dayTeacher.day,
                    cards: clas.lessons,
                });
            });

            dayTeacher.even.classes.forEach((clas) => {
                if (evenClasses.findIndex((evenClass) => evenClass.id === clas.class.id) < 0) {
                    evenClasses.push(clas.class);
                }
                if (evenDays.indexOf(dayTeacher.day) < 0) {
                    evenDays.push(dayTeacher.day);
                }
                if (!(clas.class.id in evenArray)) {
                    evenArray[clas.class.id] = [];
                }

                evenArray[clas.class.id].push({
                    day: dayTeacher.day,
                    cards: clas.lessons,
                });
            });
        });
        done = true;
    }

    return {
        done,
        teacher,
        semester: teacherSchedule.semester,
        odd: {
            days: oddDays,
            classes: oddClasses.sort((a, b) => sortStrings(a.startTime, b.startTime)),
            cards: oddArray,
        },
        even: {
            days: evenDays,
            classes: evenClasses.sort((a, b) => sortStrings(a.startTime, b.startTime)),
            cards: evenArray,
        },
    };
};
