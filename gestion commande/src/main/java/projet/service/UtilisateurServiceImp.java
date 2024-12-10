package projet.service;

import java.util.Collections;
import java.util.List;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import projet.entities.Utilisateur;
import projet.repository.UtilisateurRepository;

@Service
public class UtilisateurServiceImp implements UtilisateurService{
	
	@Autowired 
	private UtilisateurRepository userRepository;
    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;
    
    @Override
    public List<Utilisateur> findByEmailAndPassword(String email, String plaintextPassword) {
    	Utilisateur utilisateur = userRepository.findByEmail(email);

        if (utilisateur != null && bCryptPasswordEncoder.matches(plaintextPassword, utilisateur.getPassword())) {
            return Collections.singletonList(utilisateur);
        }

        return Collections.emptyList();
    }

    @Override
    public Utilisateur findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
	
    @Override
    public Utilisateur saveUtilisateur(Utilisateur user) {
        return userRepository.save(user);
    }
    
    @Override
    public Utilisateur findByClientId(Long id) {
        return userRepository.findByClientId(id);
    }
    
    @Override
    public Utilisateur findByAdminId(Long id) {
        return userRepository.findByAdminId(id);
    }
	
	

	@Override
    public Utilisateur createUtilisateur(Utilisateur utilisateur) {
        String plainPassword = utilisateur.getPassword();
        String encryptedPassword = bCryptPasswordEncoder.encode(plainPassword);
        utilisateur.setPassword(encryptedPassword);
        Utilisateur savedUser = userRepository.save(utilisateur);
        return savedUser;
    }

    @Override
	public List<Utilisateur> getAllUtilisateurs() {
		
		return userRepository.findAll();
		
	}
	
	
    @Override
    public void updatePasswordByEmail(String email, String newPassword) {
    	Utilisateur user = userRepository.findByEmail(email);

        if (user != null) {
        	
            String encryptedPassword = bCryptPasswordEncoder.encode(newPassword);
            user.setPassword(encryptedPassword);

            userRepository.save(user);
        }
    }
    
    @Override
    public String generateVerificationCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		// TODO Auto-generated method stub
		return null;
	}
    
   
}
