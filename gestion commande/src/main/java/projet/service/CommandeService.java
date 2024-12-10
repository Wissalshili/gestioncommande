package projet.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import projet.entities.Commande;
import projet.repository.CommandeRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CommandeService {

    @Autowired
    private CommandeRepository commandeRepository;

    public List<Commande> getAllCommandes() {
        return commandeRepository.findAll();
    }

    public Optional<Commande> getCommandeById(Long id) {
        return commandeRepository.findById(id);
    }

    public Commande createCommande(Commande commande) {
        if (commande.getDateCommande() == null) {
            commande.setDateCommande(LocalDateTime.now());
        }
        return commandeRepository.save(commande);
    }

    public Commande updateCommande(Long id, Commande updatedCommande) {
        return commandeRepository.findById(id).map(commande -> {
            commande.setProduit(updatedCommande.getProduit());
            commande.setQuantite(updatedCommande.getQuantite());
            commande.setPrixUnitaire(updatedCommande.getPrixUnitaire());
            commande.setTotal(updatedCommande.getTotal());
            commande.setDateCommande(LocalDateTime.now()); 
            commande.setClient(updatedCommande.getClient());
            return commandeRepository.save(commande);
        }).orElseThrow(() -> new RuntimeException("Commande not found"));
    }

    public void deleteCommande(Long id) {
        commandeRepository.deleteById(id);
    }
}
