package projet.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import projet.entities.Product;

public interface ProductRepository extends JpaRepository<Product, Long>{

}

