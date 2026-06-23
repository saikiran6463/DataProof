package com.dataproof.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

/** Tracks a single data-rights request through its full lifecycle. */
@Entity
@Table(name = "requests")
@Getter
@Setter
public class Request {

    @Id
    private String id;

    private String company;
    private String goal;
    private String jurisdiction;
    private String law;
    private String contact;
    private Integer deadlineDays;

    @Enumerated(EnumType.STRING)
    private RequestStatus status;

    @Column(columnDefinition = "TEXT")
    private String obligations;      // JSON array of obligation objects

    @Column(columnDefinition = "TEXT")
    private String draftRequest;     // AI-generated email text

    private Instant sentAt;
    private LocalDate dueBy;

    // Populated after /verify
    private Integer completeness;
    private String verdict;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(columnDefinition = "TEXT")
    private String recommendedNextStep;

    @Column(columnDefinition = "TEXT")
    private String checksJson;       // JSON array of per-obligation check results

    @PrePersist
    private void generateId() {
        if (this.id == null) {
            this.id = "req_" + UUID.randomUUID().toString().replace("-", "").substring(0, 8);
        }
    }
}
