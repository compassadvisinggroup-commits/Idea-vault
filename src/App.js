import React, { useState, useEffect } from 'react';
import './App.css';
import supabase from './supabaseClient';

// Updated Claude API functions - now call backend instead of Claude directly
async function generateSummary(description) {
  try {
    const response = await fetch('/api/claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: `Summarize this idea in one sentence: "${description}"`,
        type: 'summary'
      })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.result;
  } catch (error) {
    console.error('Error generating summary:', error);
    return 'Error generating summary';
  }
}

async function generateTags(description) {
  try {
    const response = await fetch('/api/claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: `Generate 3-5 comma-separated tags for this idea: "${description}"`,
        type: 'tags'
      })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.result;
  } catch (error) {
    console.error('Error generating tags:', error);
    return 'Error generating tags';
  }
}

async function getVettingInsights(description, type) {
  try {
    const response = await fetch('/api/claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: `For this ${type} idea, assess: 1) Feasibility (1-5), 2) Impact potential (1-5), 3) Required resources (low/medium/high). Idea: "${description}"`,
        type: 'insights'
      })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.result;
  } catch (error) {
    console.error('Error getting insights:', error);
    return 'Error generating insights';
  }
}

// Inbox Component
function Inbox({ onAddIdea }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('product');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onAddIdea({ title, description, type });
      setTitle('');
      setDescription('');
      setType('product');
    }
  };

  return (
    <section className="inbox">
      <h2>📥 Inbox</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Idea title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Describe your idea..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="product">Product</option>
          <option value="work">Work</option>
          <option value="learning">Learning</option>
          <option value="fun">Fun</option>
        </select>
        <button type="submit">Add Idea</button>
      </form>
    </section>
  );
}

// EditForm Component
function EditForm({ idea, onSave, onCancel }) {
  const [title, setTitle] = useState(idea.title);
  const [description, setDescription] = useState(idea.description);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...idea, title, description });
  };

  return (
    <div className="edit-form-overlay">
      <div className="edit-form">
        <h2>Edit Idea</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Idea title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Describe your idea..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="form-buttons">
            <button type="submit">Save</button>
            <button type="button" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// VettingPanel Component
function VettingPanel({ idea, onRate, onClose }) {
  const [ratings, setRatings] = useState(idea.ratings || { feasibility: 0, impact: 0, confidence: 0 });

  const handleRate = (category, score) => {
    const newRatings = { ...ratings, [category]: score };
    setRatings(newRatings);
    onRate(idea.id, newRatings);
  };

  return (
    <div className="edit-form-overlay">
      <div className="edit-form">
        <h2>Vet "{idea.title}"</h2>
        <div style={{ marginBottom: '20px' }}>
          <p><strong>Feasibility:</strong></p>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[1, 2, 3, 4, 5].map(score => (
              <button
                key={`feas-${score}`}
                onClick={() => handleRate('feasibility', score)}
                style={{
                  padding: '10px 16px',
                  background: ratings.feasibility === score ? '#E63946' : '#f0f0f0',
                  color: ratings.feasibility === score ? 'white' : '#333',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                {score}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <p><strong>Impact Potential:</strong></p>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[1, 2, 3, 4, 5].map(score => (
              <button
                key={`impact-${score}`}
                onClick={() => handleRate('impact', score)}
                style={{
                  padding: '10px 16px',
                  background: ratings.impact === score ? '#10B981' : '#f0f0f0',
                  color: ratings.impact === score ? 'white' : '#333',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                {score}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <p><strong>Confidence:</strong></p>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[1, 2, 3, 4, 5].map(score => (
              <button
                key={`conf-${score}`}
                onClick={() => handleRate('confidence', score)}
                style={{
                  padding: '10px 16px',
                  background: ratings.confidence === score ? '#FCD34D' : '#f0f0f0',
                  color: ratings.confidence === score ? '#333' : '#666',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                {score}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '12px',
            background: '#FF6B35',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

// FilterSection Component
function FilterSection({ searchTerm, onSearchChange, selectedType, onTypeChange }) {
  const types = ['all', 'product', 'work', 'learning', 'fun'];

  return (
    <section className="filter-section">
      <input
        type="text"
        placeholder="Search ideas..."
        className="search-input"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <div className="filter-buttons">
        {types.map(type => (
          <button
            key={type}
            className={`filter-btn ${selectedType === type ? 'active' : ''}`}
            onClick={() => onTypeChange(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>
    </section>
  );
}

// MindMap Component
function MindMap({ ideas, onEdit, onDelete, onRate }) {
  const [editingId, setEditingId] = useState(null);
  const [vettingId, setVettingId] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  const getTypeColor = (type) => {
    const colors = {
      product: '#E63946',
      work: '#10B981',
      learning: '#FCD34D',
      fun: '#FF6B35'
    };
    return colors[type] || '#FF6B35';
  };

  const handleSummarize = async (idea) => {
    setLoadingId(idea.id);
    const summary = await generateSummary(idea.description);
    alert(`Summary: ${summary}`);
    setLoadingId(null);
  };

  const handleGenerateTags = async (idea) => {
    setLoadingId(idea.id);
    const tags = await generateTags(idea.description);
    alert(`Tags: ${tags}`);
    setLoadingId(null);
  };

  const handleGetInsights = async (idea) => {
    setLoadingId(idea.id);
    const insights = await getVettingInsights(idea.description, idea.type);
    alert(`Insights: ${insights}`);
    setLoadingId(null);
  };

  return (
    <section className="mindmap">
      <h2>🧠 Your Ideas</h2>
      <div className="ideas-grid">
        {ideas.length === 0 ? (
          <p className="empty">No ideas yet. Start capturing ideas above!</p>
        ) : (
          ideas.map(idea => (
            <div
              key={idea.id}
              className="idea-card"
              style={{ borderLeftColor: getTypeColor(idea.type) }}
            >
              <h3>{idea.title}</h3>
              <p>{idea.description}</p>
              <div className="type-badge" style={{ background: getTypeColor(idea.type) }}>
                {idea.type}
              </div>
              {idea.ratings && idea.ratings.feasibility > 0 && (
                <p style={{ fontSize: '12px', color: '#10B981', marginTop: '8px' }}>
                  ⭐ Score: {((idea.ratings.feasibility + idea.ratings.impact) / 2).toFixed(1)}/5
                </p>
              )}
              <div className="card-buttons">
                <button className="edit-btn" onClick={() => setEditingId(idea.id)}>Edit</button>
                <button className="delete-btn" onClick={() => onDelete(idea.id)}>Delete</button>
                <button className="edit-btn" onClick={() => setVettingId(idea.id)}>Vet</button>
                <button
                  className="edit-btn"
                  onClick={() => handleSummarize(idea)}
                  disabled={loadingId === idea.id}
                >
                  {loadingId === idea.id ? '...' : '✨'}
                </button>
                <button
                  className="edit-btn"
                  onClick={() => handleGenerateTags(idea)}
                  disabled={loadingId === idea.id}
                >
                  {loadingId === idea.id ? '...' : '🏷️'}
                </button>
                <button
                  className="edit-btn"
                  onClick={() => handleGetInsights(idea)}
                  disabled={loadingId === idea.id}
                >
                  {loadingId === idea.id ? '...' : '💡'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      {editingId && (
        <EditForm
          idea={ideas.find(i => i.id === editingId)}
          onSave={(updatedIdea) => {
            onEdit(updatedIdea);
            setEditingId(null);
          }}
          onCancel={() => setEditingId(null)}
        />
      )}
      {vettingId && (
        <VettingPanel
          idea={ideas.find(i => i.id === vettingId)}
          onRate={onRate}
          onClose={() => setVettingId(null)}
        />
      )}
    </section>
  );
}

// Main App Component
function App() {
  const [ideas, setIdeas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    const fetchIdeas = async () => {
      const { data } = await supabase.from('ideas').select('*');
      setIdeas(data || []);
    };
    fetchIdeas();
  }, []);

  const addIdea = async (newIdea) => {
    const { data, error } = await supabase
      .from('ideas')
      .insert([{ ...newIdea, created_at: new Date() }])
      .select();
    if (!error && data) {
      setIdeas([...ideas, data[0]]);
    }
  };

  const editIdea = async (updatedIdea) => {
    const { error } = await supabase
      .from('ideas')
      .update({ title: updatedIdea.title, description: updatedIdea.description })
      .eq('id', updatedIdea.id);
    if (!error) {
      setIdeas(ideas.map(i => (i.id === updatedIdea.id ? updatedIdea : i)));
    }
  };

  const deleteIdea = async (id) => {
    if (window.confirm('Delete this idea?')) {
      await supabase.from('ideas').delete().eq('id', id);
      setIdeas(ideas.filter(i => i.id !== id));
    }
  };

  const rateIdea = async (id, ratings) => {
    const { error } = await supabase
      .from('ideas')
      .update({ ratings })
      .eq('id', id);
    if (!error) {
      setIdeas(ideas.map(i => (i.id === id ? { ...i, ratings } : i)));
    }
  };

  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          idea.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || idea.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="App">
      <header className="App-header">
        <h1>🌱 Idea Vault</h1>
        <p>Capture, organize, and vet ideas with AI-powered insights</p>
      </header>
      <main>
        <Inbox onAddIdea={addIdea} />
        <FilterSection
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
        />
        <MindMap
          ideas={filteredIdeas}
          onEdit={editIdea}
          onDelete={deleteIdea}
          onRate={rateIdea}
        />
      </main>
    </div>
  );
}

export default App;