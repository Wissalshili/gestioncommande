  import React, { useState, useEffect, useCallback } from 'react';
  import axios from 'axios';
  import Modal from 'react-modal';
  import { useNavigate } from 'react-router-dom';
  import bg from '../Images/bgr2.png';
  import dec from '../Images/dec.png';
  import '../PagesStyle/homee.css';

  Modal.setAppElement('#root');

  const Home = () => {
    const [clientId, setclientId] = useState('');
    const [userNom, setUserNom] = useState('');
    const [commandes, setcommandes] = useState([]);
    const [products, setProducts] = useState([]);
    const [productForm, setProductForm] = useState({ id: '', produit: '', quantite: '', prixUnitaireUnitaire: '', total: '', dateCommande: '' });
    const navigate = useNavigate();
    const [isLoggedOut, setIsLoggedOut] = useState(false);

    const [addMedModalOpen, setAddMedModalOpen] = useState(false);
    const [CommandeId, setCommandeId] = useState(null);
    const [updateCommandeData, setUpdateCommandeData] = useState({
      produit: '',
      quantite: '',
      prixUnitaire: '',
      total: '',
      dateCommande: '',
    });
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [newMedData, setNewMedData] = useState({
      produit: '',
      quantite: '',
      prixUnitaire: '',
      total: '',
      dateCommande: '',
    });

    const [error, setError] = useState('');

    const fetchData = useCallback(async () => {
      try {
        const clientId = localStorage.getItem('clientid');
        const clientNom = localStorage.getItem('clientnom');
        setclientId(parseInt(clientId, 10));
        setUserNom(clientNom);
        fetchallProduits(); 
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }, []);

    useEffect(() => {
      fetchData();
      fetchallCommandes();
    }, [clientId, isLoggedOut, fetchData]);


  
    const fetchallCommandes = async () => {
      try {
        const response = await axios.get('http://localhost:8080/commandes');
        setcommandes(response.data);
      } catch (error) {
        console.error('Error fetching Commandes data:', error);
      }
    };

    const fetchallProduits = async () => {
      try {
        const response = await axios.get('http://localhost:8080/products');
        if (Array.isArray(response.data)) {
          console.log('Fetched products:', response.data);
          setProducts(response.data);
        } else {
          console.error('Unexpected response format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching Produits data:', error);
      }
    };
    
    

    const handleLogout = () => {
      try {
        localStorage.removeItem('clientid');
        localStorage.removeItem('clientNom');
        localStorage.removeItem('clientquantite');
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

    const handleUpdateCommande = async () => {
      try {
        const updatedCommandeDataWithclient = {
          ...updateCommandeData,
          client: {
            id: clientId,
          },
        };

        const response = await axios.put(`http://localhost:8080/commandes/update/${CommandeId}`, updatedCommandeDataWithclient);
        setShowUpdateModal(false);
        fetchallCommandes();
      } catch (error) {
        console.error('Error updating Commande:', error);
        alert('Failed to update Commande.');
      }
    };

    const handleOpenUpdateModal = (CommandeId, produit, quantite, prixUnitaire, total, dateCommande) => {
      setCommandeId(CommandeId);
      setUpdateCommandeData({ produit, quantite, prixUnitaire, total, dateCommande });
      setShowUpdateModal(true);
    };

    const handleDeleteCommande = async (CommandeId) => {
      try {
        const confirmDelete = window.confirm('Are you sure you want to delete this Commande?');
        if (!confirmDelete) {
          return;
        }
        await axios.delete(`http://localhost:8080/commandes/delete/${CommandeId}`);
        fetchallCommandes();
      } catch (error) {
        console.error('Error deleting Commande:', error);
        alert('Failed to delete Commande.');
      }
    };

    const openAddMedModal = () => {
      setAddMedModalOpen(true);
    };

    const closeAddMedModal = () => {
      setAddMedModalOpen(false);
    };

    const handleAddCommande = async () => {
      if (!newMedData.produit || !newMedData.quantite || !newMedData.prixUnitaire || !newMedData.total) {
        setError(true);
        return;
      }
      setError(false);

      const requestData = {
        ...newMedData,
        client: {
          id: clientId,
        },
      };

      try {
        const response = await axios.post('http://localhost:8080/commandes/add', requestData);
        closeAddMedModal();
        fetchallCommandes();
      } catch (error) {
        console.error('Error adding Commande:', error);
        alert('Failed to add Commande. Check server logs for more details.');
      }
    };

    return (
      <div>
        <div className="home-container">
          <div className="logo2-container">
            <b><i><h2>Client Space Mr {userNom}</h2></i></b>
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
                <button onClick={openAddMedModal} style={{ width: '220px', marginLeft: '1050px', marginRight: '10px' }}>Ajouter un Commande</button>
                <br />
                <div className="scrollable-list">
                  <b className="bold-text"><i>Bienvenue à la liste des Commandes</i></b><br /><br />
                  <div className="table-container">
                    <table>
                      <tbody>
                        <tr>
                          <th className='abcabc'>CommandeId</th>
                          <th className='abcabc'>Produit</th>
                          <th className='abcabc'>Quantite</th>
                          <th className='abcabc'>prixUnitaire</th>
                          <th className='abcabc'>Quantite Stock</th>
                          <th className='abcabc'>Date du Commande</th>
                        </tr>
                        {commandes.map((Commande) => (
                          <tr key={Commande.id} style={{ border: '1px solid gray', padding: '10px', aligntext :"center" }}>
                            <td>{Commande.id}</td>
                            <td>{Commande.produit}</td>
                            <td>{Commande.quantite}</td>
                            <td>{Commande.prixUnitaire}</td>
                            <td>{Commande.total}</td>
                            <td>{Commande.dateCommande}</td>
                            <td>
                              <button className='btbt2' onClick={() => handleOpenUpdateModal(Commande.id, Commande.produit, Commande.quantite, Commande.prixUnitaire, Commande.total, Commande.dateCommande)}>Update</button>
                            </td>
                            <td>
                              <button className='btbt3' onClick={() => handleDeleteCommande(Commande.id)}>Delete</button>
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
          contentLabel="Modifier un Commande"
          style={{
            content: {
              width: '455px',
              textAlign: 'center',
              margin: 'auto',
              background: '#f2fbff',
              height: '450px',
              boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.7)',
            },
          }}
        >
          <h2>Modifier un Commande</h2>
          <div>
          <select
              value={updateCommandeData.produit}
              onChange={(e) =>
                setUpdateCommandeData({ ...updateCommandeData, produit: e.target.value })
              }
            >
              <option value="" disabled>
                Select Produit
              </option>
              {[...products]
                .sort((a, b) => (a.id === updateCommandeData.produit ? -1 : 0))
                .map((product) => (
                  <option key={product.id} value={product.nom}>
                    {product.nom}
                  </option>
                ))}
            </select>

          </div>
          <div>
            <input placeholder="Quantite" type="number" value={updateCommandeData.quantite}  onChange={(e) => setUpdateCommandeData({ ...updateCommandeData, quantite: e.target.value })} />
          </div>
          <div>
            <input placeholder="Prix Unitaire" type="number" value={updateCommandeData.prixUnitaire}  onChange={(e) => setUpdateCommandeData({ ...updateCommandeData, prixUnitaire: e.target.value })} />
          </div>
          <div>
            <input placeholder="Quantité en stock" type="number" value={updateCommandeData.total}  onChange={(e) => setUpdateCommandeData({ ...updateCommandeData, total: e.target.value })} />
          </div>

          <div>
            <button style={{ width: '120px',  marginRight: '10px' }} onClick={handleUpdateCommande}>Enregistrer</button>
            <button style={{ width: '120px',  marginRight: '10px' }} onClick={() => setShowUpdateModal(false)}>Annuler</button>
          </div>
        </Modal>

        <Modal
          isOpen={addMedModalOpen}
          onRequestClose={closeAddMedModal}
          contentLabel="Ajouter un Commande"
          style={{
            content: {
              width: '455px',
              textAlign: 'center',
              margin: 'auto',
              background: '#f2fbff',
              height: '450px',
              boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.7)',
            },
          }}
        >
          <h2>Ajouter un Commande</h2>
          <div>
          <select
              value={newMedData.produit || ''}
              onChange={(e) => setNewMedData({ ...newMedData, produit: e.target.value })}
            >
              <option value="">Select Produit</option>
              {products.map((product) => (
                <option key={product.id} value={product.nom}>
                  {product.nom}
                </option>
              ))}
            </select>

          </div>
          <div>
            <input placeholder="Quantite" type="number" value={newMedData.quantite} onChange={(e) => setNewMedData({ ...newMedData, quantite: e.target.value })} />
          </div>
          <div>
            <input placeholder="PrixUnitaire" value={newMedData.prixUnitaire} type="number"  onChange={(e) => setNewMedData({ ...newMedData, prixUnitaire: e.target.value })} />
          </div>
          <div>
            <input placeholder="Quantité en stock" type="number" value={newMedData.total} onChange={(e) => setNewMedData({ ...newMedData, total: e.target.value })} />
          </div>

          <div>
            <button style={{ width: '120px',  marginRight: '10px' }} onClick={handleAddCommande}>Ajouter</button>
            <button style={{ width: '120px', marginRight: '10px' }} onClick={closeAddMedModal}>Annuler</button>
          </div>
        </Modal>
      </div>
    );
  };

  export default Home;
