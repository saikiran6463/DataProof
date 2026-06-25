package com.dataproof.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateRequestBody {
    private String companyName;
    private String companyType;
    private String goal;
    private String jurisdiction;
}
