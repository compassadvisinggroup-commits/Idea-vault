import React, { useState, useEffect } from 'react';
import './App.css';
import { supabase } from './supabaseClient';

// INBOX COMPONENT - Form to capture new ideas
function Inbox({ onAddIdea }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('product');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.trim()) {
      try {
        const { data, error } = await supabase
          .from('ideas')
          .insert([{ title, description, type, status: 'raw_idea' }])
          .select();
        
        if (error) throw error;
        onAddIdea(data[0]);
        setTitle('');
        setDescription('');
      } catch (err) {
        console.error('Error saving idea:', err);
      }
    }
  };

  return (
    <div className="inbox">
      <h2>✨ Capture an Idea</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="What's your idea?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Tell me more..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="product">Product</option>
          <option value="work_tool">Work Tool</option>
          <option value="student_resource">Learning</option>
          <option value="fun">Fun Idea</option>
        </select>
        <button type="submit">Add Idea</button>
      </form>
    </div>
  );
}

// EDIT FORM COMPONENT
function EditForm({ idea, onSave, onCancel }) {
  const [title, setTitle] = useState(idea.title);
  const [description, setDescription] = useState(idea.description || '');
  const [type, setType] = useState(idea.type);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('ideas')
        .update({ title, description, type })
        .eq('id', idea.id)
        .select();
      
      if (error) throw error;
      onSave(data[0]);
    } catch (err) {
      console.error('Error updating idea:', err);
    }
  };

  return (
    <div className="edit-form-overlay">
      <div className="edit-form">
        <h2>✏️ Edit Idea</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="product">Product</option>
            <option value="work_tool">Work Tool</option>
            <option value="student_resource">Learning</option>
            <option value="fun">Fun Idea</option>
          </select>
          <div className="form-buttons">
            <button type="submit">Save Changes</button>
            <button type="button" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// VETTING PANEL COMPONENT - NEW!
function VettingPanel({ idea, onSave, onCancel }) {
  const [excitement, setExcitement] = useState(idea.excitement_rating || 0);
  const [impact, setImpact] = useState(idea.impact_rating || 0);
  const [feasibility, setFeasibility] = useState(idea.feasibility_rating || 0);
  const [cost, setCost] = useState(idea.cost_rating || 0);

  const overallScore = excitement && impact && feasibility && cost
    ? ((excitement + impact + feasibility + cost) / 4).toFixed(1)
    : 0;

  const handleSave = async (e) => {
  e.preventDefault();
  try {
    const { data, error } = await supabase
      .from('ideas')
      .update({
        excitement_rating: excitement,
        impact_rating: impact,
        feasibility_rating: feasibility,
        cost_rating: cost,
        overall_score: parseFloat(overallScore)
      })
      .eq('id', idea.id)
      .select();
    
    if (error) throw error;
    if (data && data.length > 0) {
      onSave(data[0]);
    } else {
      onCancel();
    }
  } catch (err) {
    console.error('Error saving ratings:', err);
    alert('Error saving ratings. Please try again.');
  }
};

  const RatingScale = ({ label, value, onChange, description }) => (
    <div className="rating-group">
      <label>{label}</label>
      <p className="rating-description">{description}</p>
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            className={`rating-btn ${value >= star ? 'active' : ''}`}
            onClick={() => onChange(star)}
          >
            ⭐
          </button>
        ))}
      </div>
      <span className="rating-value">{value}/5</span>
    </div>
  );

  return (
    <div className="edit-form-overlay">
      <div className="edit-form">
        <h2>⭐ Vet Idea: {idea.title}</h2>
        <form onSubmit={handleSave}>
          <RatingScale
            label="Excitement"
            value={excitement}
            onChange={setExcitement}
            description="How much do I want to work on this?"
          />
          <RatingScale
            label="Impact"
            value={impact}
            onChange={setImpact}
            description="How much would this matter?"
          />
          <RatingScale
            label="Feasibility"
            value={feasibility}
            onChange={setFeasibility}
            description="How realistic is this?"
          />
          <RatingScale
            label="Cost & Resources"
            value={cost}
            onChange={setCost}
            description="What would it take?"
          />

          <div className="overall-score">
            <h3>Overall Score: {overallScore}/5</h3>
          </div>

          <div className="form-buttons">
            <button type="submit">Save Ratings</button>
            <button type="button" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// FILTER SECTION - Search and filter controls
function FilterSection({ searchTerm, onSearchChange, selectedType, onTypeChange }) {
  const types = [
    { value: 'all', label: 'All Ideas' },
    { value: 'product', label: 'Product' },
    { value: 'work_tool', label: 'Work Tools' },
    { value: 'student_resource', label: 'Learning' },
    { value: 'fun', label: 'Fun' }
  ];

  return (
    <div className="filter-section">
      <input
        type="text"
        placeholder="🔍 Search ideas..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="search-input"
      />
      <div className="filter-buttons">
        {types.map(type => (
          <button
            key={type.value}
            className={`filter-btn ${selectedType === type.value ? 'active' : ''}`}
            onClick={() => onTypeChange(type.value)}
          >
            {type.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// MINDMAP COMPONENT
function MindMap({ ideas, onEdit, onDelete, onVet }) {
  const colors = {
    product: '#E63946',
    work_tool: '#10B981',
    student_resource: '#FCD34D',
    fun: '#FF6B35',
  };

  return (
    <div className="mindmap">
      <h2>🌱 Your Ideas</h2>
      <div className="ideas-grid">
        {ideas.length === 0 ? (
          <p className="empty">No ideas match your filters. Try a different search!</p>
        ) : (
          ideas.map((idea) => (
            <div
              key={idea.id}
              className="idea-card"
              style={{ borderColor: colors[idea.type] }}
            >
              <h3>{idea.title}</h3>
              <p>{idea.description}</p>
              <span className="type-badge" style={{ backgroundColor: colors[idea.type] }}>
                {idea.type.replace('_', ' ')}
              </span>
              {idea.overall_score && (
                <div className="idea-score">⭐ Score: {idea.overall_score}/5</div>
              )}
              <div className="card-buttons">
                <button className="edit-btn" onClick={() => onEdit(idea)}>Edit</button>
                <button className="delete-btn" onClick={() => onDelete(idea.id)}>Delete</button>
                <button className="vet-btn" onClick={() => onVet(idea)}>Vet</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// MAIN APP
function App() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingIdea, setEditingIdea] = useState(null);
  const [vettingIdea, setVettingIdea] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  // Load ideas from Supabase
  useEffect(() => {
    const loadIdeas = async () => {
      try {
        const { data, error } = await supabase
          .from('ideas')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setIdeas(data || []);
      } catch (err) {
        console.error('Error loading ideas:', err);
      } finally {
        setLoading(false);
      }
    };

    loadIdeas();
  }, []);

  // Filter ideas based on search and type
  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = idea.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || idea.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleAddIdea = (newIdea) => {
    setIdeas([newIdea, ...ideas]);
  };

  const handleEditIdea = (updatedIdea) => {
    setIdeas(ideas.map(idea => idea.id === updatedIdea.id ? updatedIdea : idea));
    setEditingIdea(null);
  };

  const handleVetIdea = (updatedIdea) => {
    setIdeas(ideas.map(idea => idea.id === updatedIdea.id ? updatedIdea : idea));
    setVettingIdea(null);
  };

  const handleDeleteIdea = async (ideaId) => {
    try {
      const { error } = await supabase
        .from('ideas')
        .delete()
        .eq('id', ideaId);
      
      if (error) throw error;
      setIdeas(ideas.filter(idea => idea.id !== ideaId));
    } catch (err) {
      console.error('Error deleting idea:', err);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🌻 Idea Vault</h1>
        <p>Where ideas grow, connect, and become decisions</p>
      </header>
      <main>
        <Inbox onAddIdea={handleAddIdea} />
        {!loading && (
          <>
            <FilterSection 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedType={selectedType}
              onTypeChange={setSelectedType}
            />
            <MindMap 
              ideas={filteredIdeas} 
              onEdit={setEditingIdea} 
              onDelete={handleDeleteIdea}
              onVet={setVettingIdea}
            />
          </>
        )}
        {editingIdea && (
          <EditForm
            idea={editingIdea}
            onSave={handleEditIdea}
            onCancel={() => setEditingIdea(null)}
          />
        )}
        {vettingIdea && (
          <VettingPanel
            idea={vettingIdea}
            onSave={handleVetIdea}
            onCancel={() => setVettingIdea(null)}
          />
        )}
      </main>
    </div>
  );
}

export default App;