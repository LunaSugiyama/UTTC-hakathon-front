import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Button, Paper, List, ListItem, ListItemText, ListItemSecondaryAction, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Layout from '../../item/layout/Layout';
import AddIcon from '@mui/icons-material/Add';
import CustomTheme from '../../item/theme/CustomTheme';
import { ThemeProvider } from '@emotion/react';
import Fab from '@mui/material/Fab';
import { set } from 'date-fns';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';


interface Curriculum {
  id: number;
  name: string;
}

const CurriculumPage: React.FC = () => {
  const [curriculumData, setCurriculumData] = useState<Curriculum[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null); // [1
  const [editedName, setEditedName] = useState<string>(''); // [2
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false); // [3
  const [newCurriculumName, setNewCurriculumName] = useState<string>(''); // [4
  const addNewRef = useRef<HTMLDivElement>(null); // [1] Create a ref
  const [emphasizeInput, setEmphasizeInput] = useState<boolean>(false); // [2

  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token');
    axios.get('https://uttc-hakathon-front.vercel.app/curriculums/showall', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      setCurriculumData(response.data);
    })
    .catch(error => {
      console.error('Error fetching curriculum data:', error);
    });
  }, []);

  const handleEdit = (id: number, name: string) => {
    setEditingId(id);
    setEditedName(name)
  }

  const handleSaveEdit = (id: number) => {
    const token = Cookies.get('token');
    if (editedName !== curriculumData.find(curriculum => curriculum.id === id)?.name) {
        const token = Cookies.get('token');
        axios.put(
          `https://uttc-hakathon-front.vercel.app/curriculums/update`,
          {
            id,
            name: editedName,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then(() => {
            // Reload the layout by navigating to the current route
            navigate('.', { replace: true });
          })
          .catch((error) => {
            console.error('Error updating curriculum:', error);
          });
    }
    setCurriculumData(curriculumData.map(curriculum => {
        if (curriculum.id === id) {
            return { ...curriculum, name: editedName };
        } else {
            return curriculum;
        }
        }));
    setEditingId(null);
    };

    const handleAddNew = () => {
        setIsAddingNew(true);
        setEmphasizeInput(true);
        setTimeout(() => {
            // Scroll to the bottom of the page
            addNewRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        setTimeout(() => {
            setEmphasizeInput(false);
        }, 1500);
        }

    const handleSaveNewCurriculum = () => {
        const token = Cookies.get('token');
        axios
          .post(
            `https://uttc-hakathon-front.vercel.app/curriculums/create`,
            {
              name: newCurriculumName,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
          .then((response) => {
            // Reload the layout by navigating to the current route
            navigate('.', { replace: true });
          })
          .catch((error) => {
            console.error('Error creating curriculum:', error);
          });
        setIsAddingNew(false);
        setNewCurriculumName('');
        }

        const handleCancelNewCurriculum = () => {
            setIsAddingNew(false);
            setNewCurriculumName('');
          }

  const handleDelete = (id: number) => {
    // Perform delete request
    const token = Cookies.get('token');
    axios.delete(`https://uttc-hakathon-front.vercel.app/curriculums/delete?id=${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      // Remove the deleted curriculum from the state
      setCurriculumData(curriculumData.filter(curriculum => curriculum.id !== id));
    })
    .catch(error => {
      console.error('Error deleting curriculum:', error);
    });
  };

  return (
    <Layout>
        < ThemeProvider theme={CustomTheme}>
        <Paper style={{ padding: '20px', margin: '20px', backgroundColor: '#f5f5f5'}}>
          <List>
            < Paper style={{ padding: '10px', margin: '10px', background: 'linear-gradient(to right, #00796b, #a5d6a7)' }}>
          <ListItem>
            <ListItemText primary={
    <Typography 
      variant="h5" 
      component="strong" 
      style={{ color: 'white' }}> {/* Set text color to white */}
      Curriculums:
    </Typography>} />
            <ListItemSecondaryAction>
                <EditIcon style={{color: "primary", margin: '30px'}} /> {/* Add margin to the right */}
                <DeleteIcon style={{color: "secondary", margin: '30px'}} />
            </ListItemSecondaryAction>
        </ListItem>
        </Paper>
            {curriculumData.map((curriculum) => (
              <ListItem key={curriculum.id}>
                {editingId === curriculum.id ? (
                  <TextField
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  variant="outlined"
                  style={{ margin: '10px 0', backgroundColor: '#e8f5e9', width:'50%' }} // Green background
                />
                ) : (
                  <ListItemText primary={curriculum.name} />
                )}

                <ListItemSecondaryAction>
                  {editingId === curriculum.id ? (
                    <Button color="primary" onClick={() => handleSaveEdit(curriculum.id)}>Save</Button>
                  ) : (
                    <>
                      <Button color="primary" onClick={() => handleEdit(curriculum.id, curriculum.name)}>Edit</Button>
                      <Button color="secondary" onClick={() => handleDelete(curriculum.id)}>Delete</Button>
                    </>
                  )}
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
          {isAddingNew && (
            <div ref={addNewRef} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
              <TextField
                value={newCurriculumName}
                onChange={(e) => setNewCurriculumName(e.target.value)}
                variant="outlined"
                placeholder="New curriculum name"
                style={emphasizeInput ? { border: '2px solid green', transition: 'border 0.5s' } : {}}
              />
              <Button color="primary" onClick={handleSaveNewCurriculum}>Save</Button>
              <Button color="secondary" onClick={handleCancelNewCurriculum}>Cancel</Button>
            </div>
          )}
        </Paper>

        <Fab aria-label="add" style={{ position: 'fixed', right: '20px', bottom: '90px', color:'#ffffff', backgroundColor:'#00796b' }} onClick={handleAddNew}>
          <AddIcon />
        </Fab>
    </ThemeProvider>
    </Layout>
  );
};

export default CurriculumPage;
