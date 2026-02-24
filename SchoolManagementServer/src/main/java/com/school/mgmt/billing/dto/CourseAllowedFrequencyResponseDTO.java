package com.school.mgmt.billing.dto;

import java.time.LocalDate;

public class CourseAllowedFrequencyResponseDTO {
    private Long id;
    private Long courseId;
    private Long billingFrequencyOptionId;
    private LocalDate allowedDate;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public Long getBillingFrequencyOptionId() {
        return billingFrequencyOptionId;
    }

    public void setBillingFrequencyOptionId(Long billingFrequencyOptionId) {
        this.billingFrequencyOptionId = billingFrequencyOptionId;
    }

    public LocalDate getAllowedDate() {
        return allowedDate;
    }

    public void setAllowedDate(LocalDate allowedDate) {
        this.allowedDate = allowedDate;
    }
}
