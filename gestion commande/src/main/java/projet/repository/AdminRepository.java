package projet.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import projet.entities.Admin;


public interface AdminRepository extends JpaRepository<Admin, Long>{

}
