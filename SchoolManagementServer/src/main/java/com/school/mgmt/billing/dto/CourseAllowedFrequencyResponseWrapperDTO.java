package com.school.mgmt.billing.dto;

import java.util.List;

public class CourseAllowedFrequencyResponseWrapperDTO {
    private Embedded _embedded;

    public Embedded get_embedded() {
        return _embedded;
    }

    public void set_embedded(Embedded _embedded) {
        this._embedded = _embedded;
    }

    public static class Embedded {
        private List<CourseAllowedFrequencyResponseDTO> courseAllowedFrequency;

        public List<CourseAllowedFrequencyResponseDTO> getCourseAllowedFrequency() {
            return courseAllowedFrequency;
        }

        public void setCourseAllowedFrequency(List<CourseAllowedFrequencyResponseDTO> courseAllowedFrequency) {
            this.courseAllowedFrequency = courseAllowedFrequency;
        }
    }
}

