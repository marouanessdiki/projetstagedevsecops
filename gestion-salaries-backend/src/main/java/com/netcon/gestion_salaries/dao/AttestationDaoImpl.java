package com.netcon.gestion_salaries.dao;

import com.netcon.gestion_salaries.dao.inteface.IAttestationDao;
import com.netcon.gestion_salaries.dao.mappers.AttestationMapper;
import com.netcon.gestion_salaries.entity.Attestation;
import com.netcon.gestion_salaries.entity.Employe;
import com.netcon.gestion_salaries.exceptions.EmployeException;
import com.netcon.gestion_salaries.records.AttestationDto;
import com.netcon.gestion_salaries.repository.AttestationRepository;
import com.netcon.gestion_salaries.repository.EmployeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class AttestationDaoImpl implements IAttestationDao {

    private final AttestationRepository attestationRepository;
    private final EmployeRepository employeRepository;
    private final AttestationMapper attestationMapper;

    @Override
    public List<AttestationDto> findByEmployeId(Long employeId) {
        List<Attestation> attestation = attestationRepository.findByEmployeId(employeId);
        return attestationMapper.fromList(attestation);
    }

    @Override
    public AttestationDto save(AttestationDto attestationDto) {
        Optional<Employe> employe = employeRepository.findById(attestationDto.getEmployeId());
        if (employe.isEmpty()) {
            throw new EmployeException("Employee n'existe pas");
        }
        Attestation attestation = attestationMapper.fromDto(attestationDto);
        Attestation savedAttestation = attestationRepository.save(attestation);
        return attestationMapper.fromEntity(savedAttestation);
    }

    @Override
    public List<AttestationDto> findAll() {
        return attestationMapper.fromList(attestationRepository.findAll());
    }

    @Override
    public AttestationDto findById(Long id) {
        return attestationMapper.fromEntity(attestationRepository.findById(id).orElse(null));
    }

    @Override
    public void updateCheminFichier(Long id, String path) {
        Optional<Attestation> attestationOpt = attestationRepository.findById(id);
        if (attestationOpt.isPresent()) {
            Attestation attestation = attestationOpt.get();
            attestation.setCheminFichier(path);
            attestationRepository.save(attestation);
        }
    }

    @Override
    public void deleteById(Long id) {
        attestationRepository.deleteById(id);
    }
}
