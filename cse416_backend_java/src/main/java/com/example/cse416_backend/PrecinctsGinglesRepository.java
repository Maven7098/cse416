package com.example.cse416_backend;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PrecinctsGinglesRepository extends MongoRepository<PrecinctsGinglesDocument, String> {
    Optional<PrecinctsGinglesDocument> findByCurrentState(String currentState);
}
