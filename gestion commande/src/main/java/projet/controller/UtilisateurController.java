package projet.controller;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import projet.security.SecurityConstraints;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import projet.config.EmailAndPasswordRequest;
import projet.entities.Admin;
import projet.entities.Client;
import projet.entities.Utilisateur;
import projet.service.AdminService;
import projet.service.ClientService;
import projet.service.UtilisateurService;


@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:8080")
public class UtilisateurController {
	
	 	private final UtilisateurService utilisateurService;
	    private final AdminService adminService;
	    private final ClientService clientService;

	
	public UtilisateurController(UtilisateurService utilisateurService, AdminService adminService,ClientService clientService ) {
	    this.utilisateurService = utilisateurService;
	    this.adminService = adminService;
	    this.clientService =  clientService;
	    
	}

	@GetMapping
	public  List<Utilisateur> getAllUtilisateurs() {
		return utilisateurService.getAllUtilisateurs();
	}

	
	@PostMapping(path="/RegisterA")
	@CrossOrigin(origins = "http://localhost:8080")
	public ResponseEntity<Admin> registerAdmin(@RequestBody Map<String, Object> request){
	    try {
	    	Admin admin = new Admin();
	    	admin.setNom((String) request.get("nom"));
	    	admin.setPrenom((String) request.get("prenom"));
	    	admin.setNumero((String) request.get("numero"));

	    	Admin savedadmin = adminService.saveAdmin(admin);

	        if (savedadmin != null) {
	            Utilisateur utilisateur = new Utilisateur();
	            utilisateur.setAdmin(savedadmin);
	            utilisateur.setEmail((String) request.get("email"));
		        utilisateur.setPassword((String) request.get("password"));

	            utilisateurService.createUtilisateur(utilisateur);

	            System.out.print(utilisateur);
	        }

	        return new ResponseEntity<>(savedadmin, HttpStatus.CREATED);
	    } catch (Exception ex) {
	        ex.printStackTrace();
	        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}

	@PutMapping("updateA/{id}")
	public ResponseEntity<Admin> updateAdmin(@PathVariable("id") Long id, @RequestBody Map<String, Object> requestBody) {
	    Admin existingAdmin = adminService.getAdminById(id);
	    if (existingAdmin != null) {
	        Admin updatedAdmin = new Admin();
	        updatedAdmin.setId(id);
	        updatedAdmin.setNom((String) requestBody.get("nom"));
	        updatedAdmin.setPrenom((String) requestBody.get("prenom"));
	        updatedAdmin.setNumero((String) requestBody.get("numero"));


	        Admin savedAdmin = adminService.saveAdmin(updatedAdmin);

	        Utilisateur utilisateur = utilisateurService.findByAdminId(id);
	        if (utilisateur != null) {
	            utilisateur.setAdmin(savedAdmin);
	            utilisateur.setEmail((String) requestBody.get("email"));
	            utilisateur.setPassword((String) requestBody.get("password"));
	            utilisateurService.createUtilisateur(utilisateur);
	        }
	        return ResponseEntity.ok(savedAdmin);
	    } else {
	        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	    }
	}
	

	@PostMapping(path = "/RegisterC")
	@CrossOrigin(origins = "http://localhost:8080")
	public ResponseEntity<Client> registerClient(@RequestBody Map<String, Object> request) {
	    try {
	    	Client client = new Client();
	    	client.setNomC((String) request.get("nom"));
	    	client.setPrenom((String) request.get("prenom"));
	    	client.setTelephone((String) request.get("telephone"));
	    	client.setAdresse((String) request.get("adresse"));
	    	
	    	Client savedClient = clientService.saveClient(client);

	        if (savedClient != null) {
	            Utilisateur utilisateur = new Utilisateur();
	            utilisateur.setClient(savedClient);
	            utilisateur.setEmail((String) request.get("email"));
		        utilisateur.setPassword((String) request.get("password"));

	            utilisateurService.createUtilisateur(utilisateur);

		           System.out.print(utilisateur);
		       }
		       return new ResponseEntity<>(savedClient, HttpStatus.CREATED);
		   } catch (Exception ex) {
		       ex.printStackTrace();
		       return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		   }
		}
	

    
	@PutMapping("updateC/{id}")
	public ResponseEntity<Client> updateClient(@PathVariable("id") Long id, @RequestBody Map<String, Object> requestBody) {
		Client existingClient = clientService.getClientById(id);
	    if (existingClient != null) {
	    	Client updatedClient = new Client();
	        updatedClient.setId(id);
	        updatedClient.setNomC((String) requestBody.get("firstname"));
	        updatedClient.setPrenom((String) requestBody.get("lastname"));
	        updatedClient.setTelephone((String) requestBody.get("department"));
	        updatedClient.setAdresse((String) requestBody.get("phone"));

	        Client savedClient = clientService.updateClient(updatedClient);

	        Utilisateur utilisateur = utilisateurService.findByClientId(id);
	        if (utilisateur != null) {
	            utilisateur.setClient(savedClient);
	            utilisateur.setEmail((String) requestBody.get("email"));
	            utilisateur.setPassword((String) requestBody.get("password"));
	            utilisateurService.createUtilisateur(utilisateur);
	        }
	        return ResponseEntity.ok(savedClient);
	    } else {
	        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	    }
	}
	

    @GetMapping("/getbyCl/{id}")
    public ResponseEntity<Utilisateur> getUtilisateurByClientId(@PathVariable("id") Long ClientId) {
        Utilisateur utilisateur = utilisateurService.findByClientId(ClientId);
        if (utilisateur != null) {
            return ResponseEntity.ok(utilisateur);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

	@PostMapping(path = "/login")
	@CrossOrigin(origins = "http://localhost:8080")
	public ResponseEntity<List<Utilisateur>> findByEmailAndPassword(@RequestBody EmailAndPasswordRequest emailpassreq) {

	    List<Utilisateur> utilisateurs = utilisateurService.findByEmailAndPassword(emailpassreq.getEmail(), emailpassreq.getPassword());
	    
	    if (utilisateurs.isEmpty()) {
	        return new ResponseEntity<List<Utilisateur>>(HttpStatus.NO_CONTENT);
	    } else {
	        Utilisateur utilisateur = utilisateurs.get(0);

	        if (utilisateur.getAdmin() != null) {
	            System.out.println("Login as Admin: " + utilisateur.getAdmin().getNom());
	        } else if (utilisateur.getClient() != null) {
	            System.out.println("Login as Client: " + utilisateur.getClient().getNomC());
	        }
	        
	        String token = generateJwtToken(utilisateur.getEmail());

	        Map<String, Object> responseBody = new HashMap<>();
	        responseBody.put("token", token);
	        responseBody.put("user", utilisateurs);

	        return new ResponseEntity<List<Utilisateur>>(utilisateurs, HttpStatus.OK);
	    }
	}	
	
	private String generateJwtToken(String email) {
	    String token = Jwts.builder()
	            .setSubject(email)
	            .setExpiration(new Date(System.currentTimeMillis() + 9999999))  
	            .signWith(SignatureAlgorithm.HS512, SecurityConstraints.SECRET_JWT)
	            .compact();

	    System.out.println("Generated JWT Token: " + token);
	    return token;
	}
	
    
	@PutMapping("/updatepass/{email}/{newPassword}")
	public ResponseEntity<String> updatePasswordByEmail(
	        @PathVariable String email,
	        @PathVariable String newPassword) {

	    try {
	    	utilisateurService.updatePasswordByEmail(email, newPassword);
	        return ResponseEntity.ok("Password and Confirm Password updated successfully!");
	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal Server Error.");
	    }
	}
	
	
}
