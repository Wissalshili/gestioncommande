package projet.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import projet.entities.Client;
import projet.entities.Utilisateur;
import projet.repository.ClientRepository;
import projet.repository.UtilisateurRepository;

import java.util.List;

import javax.transaction.Transactional;

@Service
public class ClientService {

    @Autowired
    private ClientRepository clientRepository;
    @Autowired
    private UtilisateurRepository utilisateurRepository;
    
    public Client saveClient(Client client) {
        return clientRepository.save(client);
    }

    public Client getClientById(Long id) {
        return clientRepository.findById(id).orElse(null);
    }
    
	
	public List<Client> getAllClients() {
		return clientRepository.findAll();
	}

    public Client updateClient(Client client) {
    	
        return clientRepository.save(client);
    }
    

    
    @Transactional
    public void deleteClientById(Long id) {
    	Client client = clientRepository.findById(id).orElse(null);
        if (client != null) {
            Utilisateur utilisateur = utilisateurRepository.findByClientId(id);
            if (utilisateur != null) {
                utilisateurRepository.delete(utilisateur);
            }
            clientRepository.delete(client);
        } else {
            throw new RuntimeException("Client not found with id: " + id);
        }
    }


}
