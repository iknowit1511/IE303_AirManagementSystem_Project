package com.ams.airManagement.service.implement;

import com.ams.airManagement.dto.ProvincesDTO;
import com.ams.airManagement.dto.ResponseDTO;
import com.ams.airManagement.entity.Provinces;
import com.ams.airManagement.repository.ProvincesRepository;
import com.ams.airManagement.service.interfac.ProvinceServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ams.airManagement.utils.Utils;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProvinceServiceImpl implements ProvinceServiceInterface {

    @Autowired
    private ProvincesRepository provincesRepository;

    @Override
    public ResponseDTO getAllProvinces() {
        ResponseDTO responseDTO = new ResponseDTO();
        try {
            List<Provinces> provincesList = provincesRepository.findAll();
            List<ProvincesDTO> provincesDTOList = Utils.mapLocationListEntityToProvinceListDTO(provincesList);

            responseDTO.setStatusCode(200);
            responseDTO.setMessage("Successful!");
            responseDTO.setProvinceList(provincesDTOList);
        } catch (Exception e) {
            responseDTO.setStatusCode(500);
            responseDTO.setMessage("Error fetching provinces: " + e.getMessage());
        }
        return responseDTO;
    }

}