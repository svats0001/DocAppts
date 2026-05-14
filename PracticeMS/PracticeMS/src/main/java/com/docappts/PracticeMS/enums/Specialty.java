package com.docappts.PracticeMS.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum Specialty {
    GENERAL_PRACTITIONER("General Practitioner"),
    GASTROENTEROLOGIST("Gastroenterologist"),
    NEUROLOGIST("Neurologist"),
    ENDOCRINOLOGIST("Endocrinologist"),
    IRON_INFUSIONS("Iron Infusions"),
    HEMATOLOGIST("Hematologist");

    private String displayName;

    Specialty(String displayName) {
        this.displayName = displayName;
    }

    @JsonValue
    public String displayName() {
        return displayName;
    }

    @Override
    public String toString() {
        return displayName;
    }
}
