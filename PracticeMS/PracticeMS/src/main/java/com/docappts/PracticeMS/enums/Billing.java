package com.docappts.PracticeMS.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum Billing {
    BULK_BILLED("Bulk billed"),
    MIXED("Mixed"),
    NO_BULK_BILLING("No bulk billing");

    private String displayName;

    Billing(String displayName) {
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
