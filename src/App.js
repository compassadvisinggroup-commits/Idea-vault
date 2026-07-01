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

// MINDMAP COMPONENT - Display all ideas
function MindMap({ ideas }) {
  const colors = {
    product: '#d98880',
    work_tool: '#8ab39f',
    student_resource: '#c9a876',
    fun: '#e8b8a0',
  };

  return (
    <div className="mindmap">
      <h2>🌱 Your Ideas</h2>
      <div className="ideas-grid">
        {ideas.length === 0 ? (
          <p className="empty">No ideas yet. Start capturing!</p>
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
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// MAIN APP COMPONENT
function App() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load ideas from Supabase on startup
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

  const handleAddIdea = (newIdea) => {
    setIdeas([newIdea, ...ideas]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🌻 Idea Vault</h1>
        <p>Where ideas grow, connect, and become decisions</p>
      </header>
      <main>
        <Inbox onAddIdea={handleAddIdea} />
        {loading ? <p>Loading ideas...</p> : <MindMap ideas={ideas} />}
      </main>
    </div>
  );
}

export default App;