package projet.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import projet.entities.Client;

public interface ClientRepository extends JpaRepository<Client, Long> {
	
  
}
