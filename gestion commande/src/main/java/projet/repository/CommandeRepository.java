package projet.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import projet.entities.Commande;

public interface CommandeRepository extends JpaRepository<Commande, Long>{

}
