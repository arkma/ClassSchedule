package com.softserve.repository.impl;
import com.softserve.entity.Lesson;
import com.softserve.repository.LessonRepository;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.query.Query;
import org.springframework.stereotype.Repository;

import javax.persistence.TypedQuery;
import javax.persistence.criteria.*;
import java.util.List;

@Repository
@Slf4j
public class LessonRepositoryImpl extends BasicRepositoryImpl<Lesson, Long> implements LessonRepository {


    /**
     * Method gets information about all lessons from DB
     *
     * @return List of all lessons
     */
    @Override
    public List<Lesson> getAll() {
        log.info("In getAll()");
        CriteriaBuilder cb = sessionFactory.getCurrentSession().getCriteriaBuilder();
        CriteriaQuery<Lesson> cq = cb.createQuery(Lesson.class);
        Root<Lesson> from = cq.from(Lesson.class);
        cq.where(cb.equal(from.get("teacher").get("disable"), false),
                cb.equal(from.get("subject").get("disable"), false),
                cb.equal(from.get("group").get("disable"), false));

        TypedQuery<Lesson> tq = sessionFactory.getCurrentSession().createQuery(cq);
        return tq.getResultList();
    }


    /**
     * Method gets information about all lessons for particular group from DB
     *
     * @param groupId Identity number of the group for which need to find all lessons
     * @return List of filtered lessons
     */
    @Override
    public List<Lesson> getAllForGroup(Long groupId, Long semesterId) {
        log.info("In getAllForGroup(groupId = [{}])", groupId);
        CriteriaBuilder cb = sessionFactory.getCurrentSession().getCriteriaBuilder();
        CriteriaQuery<Lesson> cq = cb.createQuery(Lesson.class);
        Root<Lesson> from = cq.from(Lesson.class);

        cq.where(cb.equal(from.get("teacher").get("disable"), false),
                cb.equal(from.get("subject").get("disable"), false),

                cb.equal(from.get("group").get("disable"), false),
                cb.equal(from.get("group").get("id"), groupId),
                cb.equal(from.get("semester").get("id"), semesterId));
        TypedQuery<Lesson> tq = sessionFactory.getCurrentSession().createQuery(cq);
        return  tq.getResultList();
    }


    /**
     * Method gets information  all lessons for teacher from DB
     *
     * @param teacherId Identity number of the teacher for which need to find all lessons
     * @return List of filtered lessons
     */
    @Override
    public List<Lesson> getLessonByTeacher(Long teacherId, Long semesterId) {
        log.info("In getLessonByTeacher(groupId = [{}])", teacherId);
        CriteriaBuilder cb = sessionFactory.getCurrentSession().getCriteriaBuilder();
        CriteriaQuery<Lesson> cq = cb.createQuery(Lesson.class);
        Root<Lesson> from = cq.from(Lesson.class);

        cq.where(cb.equal(from.get("teacher").get("disable"), false),
                cb.equal(from.get("teacher").get("id"), teacherId),
                cb.equal(from.get("subject").get("disable"), false),

                cb.equal(from.get("group").get("disable"), false),
                cb.equal(from.get("semester").get("id"), semesterId));
        TypedQuery<Lesson> tq = sessionFactory.getCurrentSession().createQuery(cq);
        return  tq.getResultList();
    }



    /**
     * Method searches duplicate of lesson in the DB
     *
     * @param lesson Lesson entity that needs to be verified
     * @return count of duplicates if such exist, else return 0
     */
    @Override
    public Long countLessonDuplicates(Lesson lesson) {
        log.info("In countLessonDuplicates(lesson = [{}])", lesson);

        CriteriaBuilder cb = sessionFactory.getCurrentSession().getCriteriaBuilder();
        CriteriaQuery<Long> cq = cb.createQuery(Long.class);
        Root<Lesson> from = cq.from(Lesson.class);

        cq.where(cb.equal(from.get("teacher").get("disable"), false),
                cb.equal(from.get("teacher").get("id"), lesson.getTeacher().getId()),

                cb.equal(from.get("subject").get("disable"), false),
                cb.equal(from.get("subject").get("id"), lesson.getSubject().getId()),

                cb.equal(from.get("group").get("disable"), false),
                cb.equal(from.get("group").get("id"), lesson.getGroup().getId()),

                cb.equal(from.get("lessonType"),lesson.getLessonType()));
        cq.select(cb.count(from));
        Query<Long> query = sessionFactory.getCurrentSession().createQuery(cq);
        return query.getSingleResult();
    }

    /**
     * Method searches duplicate of lesson in the DB
     *
     * @param lesson Lesson entity that needs to be verified
     * @return count of duplicates if such exist, else return 0
     */
    @Override
    public Long countLessonDuplicatesWithIgnoreId(Lesson lesson) {
        log.info("In countLessonDuplicates(lesson = [{}])", lesson);

        CriteriaBuilder cb = sessionFactory.getCurrentSession().getCriteriaBuilder();
        CriteriaQuery<Long> cq = cb.createQuery(Long.class);
        Root<Lesson> from = cq.from(Lesson.class);

        cq.where(cb.equal(from.get("teacher").get("disable"), false),
                cb.equal(from.get("teacher").get("id"), lesson.getTeacher().getId()),

                cb.equal(from.get("subject").get("disable"), false),
                cb.equal(from.get("subject").get("id"), lesson.getSubject().getId()),

                cb.equal(from.get("group").get("disable"), false),
                cb.equal(from.get("group").get("id"), lesson.getGroup().getId()),

                cb.notEqual(from.get("id"),lesson.getId()),
                cb.equal(from.get("lessonType"),lesson.getLessonType()));
        cq.select(cb.count(from));
        Query<Long> query = sessionFactory.getCurrentSession().createQuery(cq);
        return query.getSingleResult();
    }

    // Checking if lesson is used in Schedule table
    @Override
    protected boolean checkReference(Lesson lesson) {
        log.info("In checkReference(lesson = [{}])", lesson);
        long count = (long) sessionFactory.getCurrentSession().createQuery
                ("select count (s.id) " +
                        "from Schedule s where s.lesson.id = :lessonId")
                .setParameter("lessonId", lesson.getId())
                .getSingleResult();
        return count != 0;
    }
}
