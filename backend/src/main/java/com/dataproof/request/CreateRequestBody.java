package com.dataproof.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateRequestBody {
    private String company;
    private String companyType;
    private String goal;
    private String jurisdiction;
}
