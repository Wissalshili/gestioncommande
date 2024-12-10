import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import bg from '../Images/bgr2.png';
import dec from '../Images/dec.png';
import '../PagesStyle/homee.css';

Modal.setAppElement('#root');

const Home = () => {
  const [adminId, setAdminId] = useState('');
  const [userNom, setUserNom] = useState('');
  const [userdescription, setUserdescription] = useState('');
  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState({ id: '', nom: '', prix: '', description: '', quantiteStock: '', categorie: '' });
  const navigate = useNavigate();
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  const [addMedModalOpen, setAddMedModalOpen] = useState(false);
  const [ProduitId, setProduitId] = useState(null);
  const [updateProduitData, setUpdateProduitData] = useState({
    nom: '',
    description: '',
    prix: '',
    quantiteStock: '',
    categorie: '',
  });
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [newMedData, setNewMedData] = useState({
    nom: '',
    description: '',
    prix: '',
    quantiteStock: '',
    categorie: '',
  });

  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const adminId = localStorage.getItem('adminid');
      const adminNom = localStorage.getItem('adminNom');
      const admindescription = localStorage.getItem('admindescription');
      setAdminId(parseInt(adminId, 10));
      setUserNom(adminNom);
      setUserdescription(admindescription);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  // Fetch all products when the admin data is fetched and whenever isLoggedOut changes
  useEffect(() => {
    fetchData();
    fetchallProduits(); // Fetch products on load
  }, [adminId, isLoggedOut, fetchData]);

  const fetchallProduits = async () => {
    try {
      const response = await axios.get('http://localhost:8080/products');
      setProducts(response.data); // Update the products state with the fetched data
    } catch (error) {
      console.error('Error fetching Produits data:', error);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('adminid');
      localStorage.removeItem('adminNom');
      localStorage.removeItem('admindescription');
      setIsLoggedOut(true);

      setTimeout(() => {
        navigate('/');
      }, 500);

      const button = document.querySelector('.logout-button');
      button.classList.add('animate');
    } catch (error) {
      console.error('Error removing items from localStorage:', error);
    }
  };

  const handleUpdateProduit = async () => {
    try {
      // Ensure the admin ID is not modified
      const updatedProduitDataWithAdmin = {
        ...updateProduitData,
        admin: {
          id: adminId // Keep the same admin ID as before
        }
      };
  
      const response = await axios.put(`http://localhost:8080/products/update/${ProduitId}`, updatedProduitDataWithAdmin);
      setShowUpdateModal(false);
      fetchallProduits(); // Refresh the product list
    } catch (error) {
      console.error('Error updating Produit:', error);
      alert('Failed to update Produit.');
    }
  };
  

  const handleOpenUpdateModal = (ProduitId, nom, description, prix, quantiteStock, categorie) => {
    setProduitId(ProduitId);
    setUpdateProduitData({ nom, description, prix, quantiteStock, categorie });
    setShowUpdateModal(true);
  };

  const handleDeleteProduit = async (ProduitId) => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this Produit?');
      if (!confirmDelete) {
        return;
      }
      await axios.delete(`http://localhost:8080/products/delete/${ProduitId}`);
      fetchallProduits();
    } catch (error) {
      console.error('Error deleting Produit:', error);
      alert('Failed to delete Produit.');
    }
  };

  const openAddMedModal = () => {
    setAddMedModalOpen(true);
  };

  const closeAddMedModal = () => {
    setAddMedModalOpen(false);
  };

  const handleAddProduit = async () => {
    if (!newMedData.nom || !newMedData.description || !newMedData.prix || !newMedData.quantiteStock) {
      setError(true);
      return;
    }
    setError(false);

    const requestData = {
      ...newMedData,
      admin: {
        id: adminId
      }
    };

    try {
      const response = await axios.post('http://localhost:8080/products/add', requestData);
      console.log("Produit added successfully:", response.data); // Log success
      closeAddMedModal();
      fetchallProduits();
    } catch (error) {
      console.error('Error adding Produit:', error);
      alert('Failed to add Produit. Check server logs for more details.');
    }
  };

  return (
    <div>
      <div className="home-container">
        <div className="logo2-container">
          <b><i><h2>Admin Space Mr {userNom} {userdescription}</h2></i></b>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', marginTop: "-50px", minHeight: '99vh' }}>
          <div style={{ flex: 1 }}>
            <a href="#" className="logout-button" onClick={handleLogout}>
              <div className="logout-content">
                <img className="img-button" src={dec} alt="Logout" />
                <span>Déconnexion</span>
              </div>
            </a>
          </div>
          <div style={{ flex: 5 }}>
            <div className="gray-box">
              <button onClick={openAddMedModal} style={{ width: '190px', marginLeft: '1050px', marginRight: '10px' }}>Ajouter un produit</button>
              <br />
              <div className="scrollable-list">
                <b className="bold-text"><i>Bienvenue à la liste des produits</i></b><br /><br />
                <div className="table-container">
                  <table>
                    <tbody>
                      <tr>
                        <th className='abcabc'>ProduitId</th>
                        <th className='abcabc'>Nom</th>
                        <th className='abcabc'>Description</th>
                        <th className='abcabc'>Prix</th>
                        <th className='abcabc'>Quantite Stock</th>
                        <th className='abcabc'>Categorie</th>
                      </tr>
                      {products.map((Produit) => (
                        <tr key={Produit.id} style={{ border: '1px solid gray', padding: '10px', aligntext :"center" }}>
                          <td>{Produit.id}</td>
                          <td>{Produit.nom}</td>
                          <td>{Produit.description}</td>
                          <td>{Produit.prix}</td>
                          <td>{Produit.quantiteStock}</td>
                          <td>{Produit.categorie}</td>
                          <td>
                            <button className='btbt2' onClick={() => handleOpenUpdateModal(Produit.id, Produit.nom, Produit.description, Produit.prix, Produit.quantiteStock, Produit.categorie)}>Update</button>
                          </td>
                          <td>
                            <button className='btbt3' onClick={() => handleDeleteProduit(Produit.id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <img src={bg} className="background-image" alt="Background" />
      </div>
      <Modal
        isOpen={showUpdateModal}
        onRequestClose={() => setShowUpdateModal(false)}
        contentLabel="Modifier un produit"
        style={{
          content: {
            width: '455px',
            textAlign: 'center',
            margin: 'auto',
            background: '#f2fbff',
            height: '620px',
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.7)'
          }
        }}
      >
        <h2>Modifier un produit</h2>
        <div>
          <input placeholder="Nom" value={updateProduitData.nom} onChange={(e) => setUpdateProduitData({ ...updateProduitData, nom: e.target.value })} />
        </div>
        <div>
          <input placeholder="Description" value={updateProduitData.description} onChange={(e) => setUpdateProduitData({ ...updateProduitData, description: e.target.value })} />
        </div>
        <div>
          <input placeholder="Prix" value={updateProduitData.prix} onChange={(e) => setUpdateProduitData({ ...updateProduitData, prix: e.target.value })} />
        </div>
        <div>
          <input placeholder="Quantité en stock" value={updateProduitData.quantiteStock} onChange={(e) => setUpdateProduitData({ ...updateProduitData, quantiteStock: e.target.value })} />
        </div>
        <div>
          <input placeholder="Categorie" value={updateProduitData.categorie} onChange={(e) => setUpdateProduitData({ ...updateProduitData, categorie: e.target.value })} />
        </div>
        <div>
          <button onClick={handleUpdateProduit}>Enregistrer les modifications</button>
          <button onClick={() => setShowUpdateModal(false)}>Annuler</button>
        </div>
      </Modal>
      
      {/* Add Product Modal */}
      <Modal
        isOpen={addMedModalOpen}
        onRequestClose={closeAddMedModal}
        contentLabel="Ajouter un produit"
        style={{
          content: {
            width: '455px',
            textAlign: 'center',
            margin: 'auto',
            background: '#f2fbff',
            height: '620px',
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.7)'
          }
        }}
      >
        <h2>Ajouter un produit</h2>
        <div>
          <input placeholder="Nom" value={newMedData.nom} onChange={(e) => setNewMedData({ ...newMedData, nom: e.target.value })} />
        </div>
        <div>
          <input placeholder="Description" value={newMedData.description} onChange={(e) => setNewMedData({ ...newMedData, description: e.target.value })} />
        </div>
        <div>
          <input placeholder="Prix" value={newMedData.prix} type="number"  onChange={(e) => setNewMedData({ ...newMedData, prix: e.target.value })} />
        </div>
        <div>
          <input placeholder="Quantité en stock" type="number" value={newMedData.quantiteStock} onChange={(e) => setNewMedData({ ...newMedData, quantiteStock: e.target.value })} />
        </div>
        <div>
          <input placeholder="Categorie" value={newMedData.categorie} onChange={(e) => setNewMedData({ ...newMedData, categorie: e.target.value })} />
        </div>
        <div>
          <button onClick={handleAddProduit}>Ajouter</button>
          <button onClick={closeAddMedModal}>Annuler</button>
        </div>
      </Modal>
    </div>
  );
};

export default Home;
