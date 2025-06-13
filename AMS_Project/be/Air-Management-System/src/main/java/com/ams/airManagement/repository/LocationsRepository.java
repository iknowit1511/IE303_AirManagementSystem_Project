package com.ams.airManagement.repository;


import com.ams.airManagement.entity.Locations;
import com.ams.airManagement.entity.Provinces;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface LocationsRepository extends JpaRepository<Locations, Integer> {
    List<Locations> findByProvince_ProvinceIdAndLocationType(String provinceId, String locationType);
    List<Locations> findByProvince_ProvinceId(String provinceId);
    List<Locations> findByProvince_ProvinceIdAndLocationTypeIn(String provinceId, List<String> locationTypes);
    Optional<Locations> findByLocationNameAndProvince_ProvinceId(String locationName, String provinceId);

    @Query("SELECT DISTINCT l.province FROM Locations l WHERE l.locationType = ?1")
    List<Provinces> findDistinctProvincesByLocationType(String locationType);
}
