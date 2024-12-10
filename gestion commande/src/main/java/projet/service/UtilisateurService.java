package projet.service;

import java.util.List;
import org.springframework.security.core.userdetails.UserDetailsService;
import projet.entities.Utilisateur;


public interface UtilisateurService extends UserDetailsService {
	
	public List<Utilisateur> findByEmailAndPassword(String email, String password);
	public Utilisateur findByEmail(String email);
    public Utilisateur createUtilisateur(Utilisateur utilisateur);
	public List<Utilisateur> getAllUtilisateurs();
	public Utilisateur saveUtilisateur(Utilisateur user);
	public Utilisateur findByClientId(Long id);
	public Utilisateur findByAdminId(Long id);
	
	void updatePasswordByEmail(String email, String newPassword);
	public String generateVerificationCode();
}
