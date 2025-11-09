import React, { useState, useEffect } from 'react';
import { AlertCircle, Trash2, ShoppingCart, TrendingDown, Leaf, DollarSign, Plus, X, Calendar, Package, Camera, Check } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function FoodWasteTracker() {
  const [view, setView] = useState('inventory');
  const [items, setItems] = useState([]);
  const [wasteLog, setWasteLog] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showWasteModal, setShowWasteModal] = useState(false);
  const [showConsumedModal, setShowConsumedModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [pennyMessage, setPennyMessage] = useState('');
  const [showReceiptScanner, setShowReceiptScanner] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scannedItems, setScannedItems] = useState([]);
  const [consumedLog, setConsumedLog] = useState([]);
  const [receiptImage, setReceiptImage] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  const [newItem, setNewItem] = useState({
    name: '',
    category: 'produce',
    quantity: 1,
    unit: 'items',
    purchaseDate: new Date().toISOString().split('T')[0],
    expirationDate: ''
  });

  const [wasteEntry, setWasteEntry] = useState({
    reason: 'expired',
    amount: 1
  });

  useEffect(() => {
    const stored = localStorage.getItem('foodWasteData');
    if (stored) {
      const data = JSON.parse(stored);
      setItems(data.items || []);
      setWasteLog(data.wasteLog || []);
      setConsumedLog(data.consumedLog || []);
    }

    // Penny's welcome message
    setPennyMessage(getPennyMessage('welcome', { itemCount: 0, urgentCount: 0 }));
  }, []);

  useEffect(() => {
    localStorage.setItem('foodWasteData', JSON.stringify({ items, wasteLog, consumedLog }));
  }, [items, wasteLog, consumedLog]);

  const getPennyMessage = (type, data = {}) => {
    const messages = {
      welcome: [
        "Hi! I'm Penny the Parsnip! 🥕 Let's save some food together!",
        "Hey there! Penny here, ready to help you fight food waste! 💪",
        "Welcome back! Let's keep those groceries fresh! 🌱"
      ],
      addItem: [
        "Great! Another item saved from waste! 🎉",
        "Awesome! I'll help you remember to use that! ✨",
        "Nice one! Let's make sure it doesn't go to waste! 🌟"
      ],
      urgent: [
        `Psst! You have ${data.urgentCount} item${data.urgentCount > 1 ? 's' : ''} that need attention soon! 😰`,
        `Quick! ${data.urgentCount} item${data.urgentCount > 1 ? 's are' : ' is'} about to expire! 🚨`,
        `Don't forget about those ${data.urgentCount} expiring item${data.urgentCount > 1 ? 's' : ''}! ⏰`
      ],
      waste: [
        "Oh no! Let's learn from this and do better next time! 💚",
        "Every mistake is a learning opportunity! We've got this! 🌍",
        "Don't worry, we'll reduce waste together! Keep trying! 💪"
      ],
      goodJob: [
        "You're doing amazing! Keep up the great work! 🌟",
        "Look at that impact! You're a food-saving hero! 🦸",
        "Wow! Your planet thanks you! 🌎💚"
      ],
      empty: [
        "Ready to start tracking? Add your first item! 📝",
        "Let's build a waste-free kitchen together! 🏡",
        "Time to start your food-saving journey! 🚀"
      ],
      scanning: [
        "Analyzing your receipt... I'm so excited! 📸",
        "Reading all those items... This is so cool! 🤓",
        "Almost there... Getting those expiration dates! ⚡"
      ],
      consumed: [
        "YES! That's what I'm talking about! Way to go! 🎉",
        "Amazing! Zero waste is the best waste! 💚",
        "You're crushing it! Keep eating that food! 🌟",
        "Perfect! That's exactly what we want to see! 🙌"
      ]
    };

    const messageSet = messages[type] || messages.welcome;
    return messageSet[Math.floor(Math.random() * messageSet.length)];
  };

  const categories = ['produce', 'dairy', 'meat', 'pantry', 'frozen', 'other'];
  const units = ['items', 'lbs', 'oz', 'kg', 'g'];
  const wasteReasons = ['expired', 'spoiled', 'forgot', 'too much', 'other'];

  const addItem = () => {
    if (!newItem.name || !newItem.expirationDate) return;

    const item = {
      ...newItem,
      id: Date.now(),
      addedDate: new Date().toISOString()
    };

    setItems([...items, item]);
    setPennyMessage(getPennyMessage('addItem'));
    setNewItem({
      name: '',
      category: 'produce',
      quantity: 1,
      unit: 'items',
      purchaseDate: new Date().toISOString().split('T')[0],
      expirationDate: ''
    });
    setShowAddModal(false);
  };

  const logWaste = () => {
    if (!selectedItem) return;

    const waste = {
      id: Date.now(),
      itemName: selectedItem.name,
      category: selectedItem.category,
      amount: wasteEntry.amount,
      unit: selectedItem.unit,
      reason: wasteEntry.reason,
      date: new Date().toISOString(),
      estimatedCost: calculateCost(selectedItem.category, wasteEntry.amount),
      co2: calculateCO2(selectedItem.category, wasteEntry.amount)
    };

    setWasteLog([...wasteLog, waste]);
    setItems(items.filter(i => i.id !== selectedItem.id));
    setPennyMessage(getPennyMessage('waste'));
    setShowWasteModal(false);
    setSelectedItem(null);
    setWasteEntry({ reason: 'expired', amount: 1 });
  };

  const simulateReceiptScan = () => {
    setIsProcessing(true);
    setPennyMessage(getPennyMessage('scanning'));

    // Simulate processing delay
    setTimeout(() => {
      const today = new Date();
      const mockItems = [
        {
          name: 'Organic Milk',
          category: 'dairy',
          quantity: 1,
          unit: 'items',
          expirationDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        },
        {
          name: 'Strawberries',
          category: 'produce',
          quantity: 1,
          unit: 'lbs',
          expirationDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        },
        {
          name: 'Chicken Breast',
          category: 'meat',
          quantity: 2,
          unit: 'lbs',
          expirationDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        },
        {
          name: 'Bread',
          category: 'pantry',
          quantity: 1,
          unit: 'items',
          expirationDate: new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
      ];

      setScannedItems(mockItems);
      setIsProcessing(false);
    }, 2500);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please upload an image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be less than 5MB');
      return;
    }

    setUploadError(null);
    setIsProcessing(true);
    setPennyMessage(getPennyMessage('scanning'));

    try {
      // Convert image to base64
      const base64Image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      setReceiptImage(URL.createObjectURL(file));

      // Call Claude API to analyze receipt
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'image',
                  source: {
                    type: 'base64',
                    media_type: file.type,
                    data: base64Image
                  }
                },
                {
                  type: 'text',
                  text: `Analyze this grocery receipt and extract the food items. For each food item, provide:
1. Item name
2. Category (one of: produce, dairy, meat, pantry, frozen, other)
3. Estimated quantity (as a number)
4. Unit (one of: items, lbs, oz, kg, g)
5. Estimated expiration date from today (as days from now)

Return ONLY a JSON array with no preamble or explanation. Format:
[
  {
    "name": "Item Name",
    "category": "produce",
    "quantity": 1,
    "unit": "items",
    "daysUntilExpiration": 7
  }
]

Only include actual food items that expire (not paper products, cleaning supplies, etc.). If you cannot read the receipt clearly, return an empty array.`
                }
              ]
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze receipt');
      }

      const data = await response.json();
      const textContent = data.content.find(item => item.type === 'text')?.text || '[]';

      // Parse the JSON response
      let extractedItems = [];
      try {
        const cleanedText = textContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        extractedItems = JSON.parse(cleanedText);
      } catch (e) {
        console.error('Failed to parse response:', e);
        setUploadError('Could not extract items from receipt. Please try a clearer image.');
        setIsProcessing(false);
        return;
      }

      // Convert to our format
      const today = new Date();
      const formattedItems = extractedItems.map(item => ({
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        unit: item.unit,
        expirationDate: new Date(today.getTime() + item.daysUntilExpiration * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0]
      }));

      setScannedItems(formattedItems);
      setPennyMessage("Wow! I found those items on your receipt! 📸");
      setIsProcessing(false);

    } catch (error) {
      console.error('Error processing receipt:', error);
      setUploadError('Failed to process receipt. Please try again.');
      setIsProcessing(false);
    }
  };

  const addScannedItems = () => {
    const newItems = scannedItems.map(item => ({
      ...item,
      id: Date.now() + Math.random(),
      addedDate: new Date().toISOString(),
      purchaseDate: new Date().toISOString().split('T')[0]
    }));

    setItems([...items, ...newItems]);
    setPennyMessage("Wow! All those items added in seconds! You're a pro! 🚀");
    setShowReceiptScanner(false);
    setScannedItems([]);
    setReceiptImage(null);
    setUploadError(null);
  };

  const markAsConsumed = () => {
    if (!selectedItem) return;

    const consumed = {
      id: Date.now(),
      itemName: selectedItem.name,
      category: selectedItem.category,
      amount: selectedItem.quantity,
      unit: selectedItem.unit,
      date: new Date().toISOString(),
      savedCost: calculateCost(selectedItem.category, selectedItem.quantity),
      savedCO2: calculateCO2(selectedItem.category, selectedItem.quantity)
    };

    setConsumedLog([...consumedLog, consumed]);
    setItems(items.filter(i => i.id !== selectedItem.id));
    setPennyMessage(getPennyMessage('consumed'));
    setShowConsumedModal(false);
    setSelectedItem(null);
  };

  const calculateCost = (category, amount) => {
    const avgCosts = {
      produce: 2.5,
      dairy: 3.5,
      meat: 8,
      pantry: 2,
      frozen: 4,
      other: 3
    };
    return (avgCosts[category] || 3) * amount;
  };

  const calculateCO2 = (category, amount) => {
    const co2PerUnit = {
      produce: 0.5,
      dairy: 1.2,
      meat: 3.5,
      pantry: 0.3,
      frozen: 0.8,
      other: 0.6
    };
    return (co2PerUnit[category] || 0.5) * amount;
  };

  const getDaysUntilExpiration = (expirationDate) => {
    const today = new Date();
    const expDate = new Date(expirationDate);
    const diffTime = expDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpirationStatus = (days) => {
    if (days < 0) return { color: 'bg-red-100 text-red-800', text: 'Expired' };
    if (days <= 2) return { color: 'bg-orange-100 text-orange-800', text: `${days}d left` };
    if (days <= 5) return { color: 'bg-yellow-100 text-yellow-800', text: `${days}d left` };
    return { color: 'bg-green-100 text-green-800', text: `${days}d left` };
  };

  const totalWaste = wasteLog.reduce((sum, w) => sum + w.estimatedCost, 0);
  const totalCO2 = wasteLog.reduce((sum, w) => sum + w.co2, 0);
  const itemsWasted = wasteLog.length;

  const totalSaved = consumedLog.reduce((sum, c) => sum + c.savedCost, 0);
  const totalCO2Saved = consumedLog.reduce((sum, c) => sum + c.savedCO2, 0);
  const itemsConsumed = consumedLog.length;

  const sortedItems = [...items].sort((a, b) => {
    return getDaysUntilExpiration(a.expirationDate) - getDaysUntilExpiration(b.expirationDate);
  });

  const urgentItems = sortedItems.filter(item => getDaysUntilExpiration(item.expirationDate) <= 2);

  // Prepare chart data
  const getChartData = () => {
    const allEntries = [
      ...wasteLog.map(w => ({ ...w, type: 'waste' })),
      ...consumedLog.map(c => ({ ...c, type: 'consumed' }))
    ].sort((a, b) => new Date(a.date) - new Date(b.date));

    if (allEntries.length === 0) return [];

    // Group by date
    const dateMap = {};
    allEntries.forEach(entry => {
      const date = new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!dateMap[date]) {
        dateMap[date] = { date, waste: 0, consumed: 0, wasteCost: 0, savedCost: 0 };
      }
      if (entry.type === 'waste') {
        dateMap[date].waste += 1;
        dateMap[date].wasteCost += entry.estimatedCost;
      } else {
        dateMap[date].consumed += 1;
        dateMap[date].savedCost += entry.savedCost;
      }
    });

    return Object.values(dateMap);
  };

  const chartData = getChartData();

  // Update Penny's message based on urgent items
  useEffect(() => {
    if (urgentItems.length > 0 && view === 'inventory') {
      setPennyMessage(getPennyMessage('urgent', { urgentCount: urgentItems.length }));
    } else if (items.length === 0) {
      setPennyMessage(getPennyMessage('empty'));
    } else if (wasteLog.length > 0 && totalCO2 > 5) {
      setPennyMessage(getPennyMessage('goodJob'));
    }
  }, [urgentItems.length, view, items.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Leaf className="text-green-600" size={32} />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Fridgeworth</h1>
                <p className="text-sm text-gray-500">Track. Save. Sustain.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowReceiptScanner(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <Camera size={20} />
                Scan Receipt
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                <Plus size={20} />
                Add Item
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setView('inventory')}
              className={`px-6 py-3 font-medium transition ${view === 'inventory'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <div className="flex items-center gap-2">
                <Package size={18} />
                Inventory ({items.length})
              </div>
            </button>
            <button
              onClick={() => setView('waste')}
              className={`px-6 py-3 font-medium transition ${view === 'waste'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <div className="flex items-center gap-2">
                <Trash2 size={18} />
                Waste Log
              </div>
            </button>
            <button
              onClick={() => setView('analytics')}
              className={`px-6 py-3 font-medium transition ${view === 'analytics'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <div className="flex items-center gap-2">
                <TrendingDown size={18} />
                Impact
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Penny the Parsnip */}
        <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-2xl p-6 mb-6 shadow-md border-2 border-orange-200">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <svg width="80" height="80" viewBox="0 0 80 80" className="drop-shadow-lg">
                {/* Parsnip body */}
                <path d="M35 10 Q35 5 40 5 Q45 5 45 10 L47 35 Q47 50 40 60 Q33 50 33 35 Z" fill="#F5DEB3" stroke="#8B7355" strokeWidth="2" />
                {/* Leaves */}
                <path d="M37 8 Q30 5 28 10 Q27 12 30 13 L37 10" fill="#90EE90" stroke="#228B22" strokeWidth="1.5" />
                <path d="M43 8 Q50 5 52 10 Q53 12 50 13 L43 10" fill="#90EE90" stroke="#228B22" strokeWidth="1.5" />
                <path d="M40 6 Q38 0 40 2 Q42 0 40 6" fill="#90EE90" stroke="#228B22" strokeWidth="1.5" />
                {/* Face */}
                <circle cx="37" cy="25" r="2" fill="#000" />
                <circle cx="43" cy="25" r="2" fill="#000" />
                {/* Happy mouth */}
                <path d="M35 30 Q40 34 45 30" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round" />
                {/* Rosy cheeks */}
                <circle cx="33" cy="28" r="3" fill="#FFB6C6" opacity="0.6" />
                <circle cx="47" cy="28" r="3" fill="#FFB6C6" opacity="0.6" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-orange-900 text-lg">Penny the Parsnip</h3>
                <span className="text-sm bg-white px-2 py-0.5 rounded-full text-orange-700 border border-orange-300">
                  Your Food Waste Coach
                </span>
              </div>
              <p className="text-orange-800 text-base leading-relaxed">
                {pennyMessage}
              </p>
            </div>
          </div>
        </div>

        {/* Urgent Items Alert */}
        {urgentItems.length > 0 && view === 'inventory' && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-orange-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="font-semibold text-orange-900">Urgent: Items expiring soon!</h3>
                <p className="text-sm text-orange-700 mt-1">
                  {urgentItems.length} item{urgentItems.length > 1 ? 's' : ''} expiring in 2 days or less
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Inventory View */}
        {view === 'inventory' && (
          <div>
            {items.length === 0 ? (
              <div className="text-center py-16">
                <Package className="mx-auto text-gray-300 mb-4" size={64} />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No items yet</h3>
                <p className="text-gray-500 mb-4">Start tracking your groceries to reduce waste</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Add Your First Item
                </button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sortedItems.map(item => {
                  const daysLeft = getDaysUntilExpiration(item.expirationDate);
                  const status = getExpirationStatus(daysLeft);
                  return (
                    <div key={item.id} className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-800 text-lg">{item.name}</h3>
                          <p className="text-sm text-gray-500 capitalize">{item.category}</p>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              setSelectedItem(item);
                              setShowConsumedModal(true);
                            }}
                            className="text-green-600 hover:text-green-700 p-1 hover:bg-green-50 rounded transition"
                            title="Mark as eaten"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedItem(item);
                              setWasteEntry({ ...wasteEntry, amount: item.quantity });
                              setShowWasteModal(true);
                            }}
                            className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition"
                            title="Mark as wasted"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Quantity:</span>
                          <span className="font-medium">{item.quantity} {item.unit}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Expires:</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                            {status.text}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Waste Log View */}
        {view === 'waste' && (
          <div>
            {wasteLog.length === 0 ? (
              <div className="text-center py-16">
                <Leaf className="mx-auto text-gray-300 mb-4" size={64} />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No waste logged yet</h3>
                <p className="text-gray-500">Keep up the good work!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {[...wasteLog].reverse().map(waste => (
                  <div key={waste.id} className="bg-white rounded-lg shadow-sm border p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{waste.itemName}</h3>
                        <div className="flex gap-4 mt-2 text-sm text-gray-600">
                          <span className="capitalize">{waste.category}</span>
                          <span>•</span>
                          <span>{waste.amount} {waste.unit}</span>
                          <span>•</span>
                          <span className="capitalize">{waste.reason}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-red-600 font-semibold">${waste.estimatedCost.toFixed(2)}</div>
                        <div className="text-xs text-gray-500">{waste.co2.toFixed(1)} kg CO₂</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Analytics View */}
        {view === 'analytics' && (
          <div className="space-y-6">
            {/* Success Metrics */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">✅ Food Saved (Eaten!)</h2>
              <div className="grid gap-4 md:grid-cols-3 mb-8">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-sm border-2 border-green-200 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-green-200 p-3 rounded-lg">
                      <DollarSign className="text-green-700" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-green-700 font-medium">Money Saved</p>
                      <p className="text-2xl font-bold text-green-900">${totalSaved.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-sm border-2 border-green-200 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-green-200 p-3 rounded-lg">
                      <Leaf className="text-green-700" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-green-700 font-medium">CO₂ Saved</p>
                      <p className="text-2xl font-bold text-green-900">{totalCO2Saved.toFixed(1)} kg</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-sm border-2 border-green-200 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-green-200 p-3 rounded-lg">
                      <Check className="text-green-700" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-green-700 font-medium">Items Eaten</p>
                      <p className="text-2xl font-bold text-green-900">{itemsConsumed}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Waste Metrics */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">📉 Food Wasted</h2>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-red-100 p-3 rounded-lg">
                      <DollarSign className="text-red-600" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Money Wasted</p>
                      <p className="text-2xl font-bold text-gray-800">${totalWaste.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-orange-100 p-3 rounded-lg">
                      <Leaf className="text-orange-600" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">CO₂ Impact</p>
                      <p className="text-2xl font-bold text-gray-800">{totalCO2.toFixed(1)} kg</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Trash2 className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Items Wasted</p>
                      <p className="text-2xl font-bold text-gray-800">{itemsWasted}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Success Rate */}
            {(itemsConsumed + itemsWasted) > 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Your Success Rate</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-8 relative overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-600 h-8 rounded-full transition-all duration-500 flex items-center justify-center"
                        style={{ width: `${(itemsConsumed / (itemsConsumed + itemsWasted)) * 100}%` }}
                      >
                        <span className="text-white font-bold text-sm">
                          {Math.round((itemsConsumed / (itemsConsumed + itemsWasted)) * 100)}% Saved
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{itemsConsumed} eaten / {itemsConsumed + itemsWasted} total</p>
                  </div>
                </div>
              </div>
            )}

            {/* Charts */}
            {chartData.length > 0 && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Items Over Time</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="consumed" stroke="#10b981" strokeWidth={2} name="Items Eaten" />
                      <Line type="monotone" dataKey="waste" stroke="#ef4444" strokeWidth={2} name="Items Wasted" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Money Impact Over Time</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value) => `${value.toFixed(2)}`} />
                      <Legend />
                      <Bar dataKey="savedCost" fill="#10b981" name="Money Saved" />
                      <Bar dataKey="wasteCost" fill="#ef4444" name="Money Wasted" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {wasteLog.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Waste by Category</h3>
                <div className="space-y-3">
                  {categories.map(category => {
                    const categoryWaste = wasteLog.filter(w => w.category === category);
                    const categoryTotal = categoryWaste.reduce((sum, w) => sum + w.estimatedCost, 0);
                    if (categoryTotal === 0) return null;
                    const percentage = (categoryTotal / totalWaste) * 100;

                    return (
                      <div key={category}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize text-gray-700">{category}</span>
                          <span className="text-gray-600">${categoryTotal.toFixed(2)} ({percentage.toFixed(0)}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {wasteLog.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Waste Reasons</h3>
                <div className="space-y-2">
                  {wasteReasons.map(reason => {
                    const count = wasteLog.filter(w => w.reason === reason).length;
                    if (count === 0) return null;
                    const percentage = (count / wasteLog.length) * 100;

                    return (
                      <div key={reason} className="flex justify-between items-center">
                        <span className="capitalize text-gray-700">{reason}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">{count} items</span>
                          <span className="text-xs text-gray-500">({percentage.toFixed(0)}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Add Grocery Item</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Milk, Apples, Chicken"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat} className="capitalize">{cat}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: parseFloat(e.target.value) || 1 })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="0.1"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <select
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {units.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
                <input
                  type="date"
                  value={newItem.expirationDate}
                  onChange={(e) => setNewItem({ ...newItem, expirationDate: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={addItem}
                disabled={!newItem.name || !newItem.expirationDate}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Waste Modal */}
      {showWasteModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Log Waste</h2>
              <button onClick={() => {
                setShowWasteModal(false);
                setSelectedItem(null);
              }} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-gray-800">{selectedItem.name}</h3>
              <p className="text-sm text-gray-600 capitalize">{selectedItem.category}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount Wasted</label>
                <input
                  type="number"
                  value={wasteEntry.amount}
                  onChange={(e) => setWasteEntry({ ...wasteEntry, amount: parseFloat(e.target.value) || 1 })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="0.1"
                  step="0.1"
                />
                <p className="text-xs text-gray-500 mt-1">of {selectedItem.quantity} {selectedItem.unit}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <select
                  value={wasteEntry.reason}
                  onChange={(e) => setWasteEntry({ ...wasteEntry, reason: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {wasteReasons.map(reason => (
                    <option key={reason} value={reason} className="capitalize">{reason}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowWasteModal(false);
                  setSelectedItem(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={logWaste}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Log Waste
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Consumed Modal */}
      {showConsumedModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Ate It! 🎉</h2>
              <button onClick={() => {
                setShowConsumedModal(false);
                setSelectedItem(null);
              }} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <div className="bg-green-50 rounded-lg p-4 mb-4 border-2 border-green-200">
              <h3 className="font-semibold text-gray-800 text-lg">{selectedItem.name}</h3>
              <p className="text-sm text-gray-600 capitalize mt-1">{selectedItem.category} • {selectedItem.quantity} {selectedItem.unit}</p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">By eating this, you saved:</p>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-green-700">💰 Money:</span>
                  <span className="font-bold text-green-800">${calculateCost(selectedItem.category, selectedItem.quantity).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">🌍 CO₂:</span>
                  <span className="font-bold text-green-800">{calculateCO2(selectedItem.category, selectedItem.quantity).toFixed(1)} kg</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowConsumedModal(false);
                  setSelectedItem(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={markAsConsumed}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
              >
                Confirm ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Scanner Modal */}
      {showReceiptScanner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Scan Receipt</h2>
              <button
                onClick={() => {
                  setShowReceiptScanner(false);
                  setScannedItems([]);
                  setReceiptImage(null);
                  setIsProcessing(false);
                  setUploadError(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            {!isProcessing && scannedItems.length === 0 && (
              <div>
                {uploadError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <p className="text-red-800 text-sm">{uploadError}</p>
                  </div>
                )}

                <div className="bg-gray-100 rounded-lg aspect-[4/3] flex items-center justify-center mb-4 border-2 border-dashed border-gray-300 relative overflow-hidden">
                  {receiptImage ? (
                    <img src={receiptImage} alt="Receipt" className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-center">
                      <Camera className="mx-auto text-gray-400 mb-3" size={64} />
                      <p className="text-gray-600 mb-4">Upload a photo of your receipt</p>
                      <p className="text-sm text-gray-500">Supports JPG, PNG (max 5MB)</p>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-lg file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100
                        cursor-pointer"
                    />
                  </label>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">or try demo</span>
                    </div>
                  </div>

                  <button
                    onClick={simulateReceiptScan}
                    className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
                  >
                    Use Sample Receipt (Demo)
                  </button>
                </div>
              </div>
            )}

            {isProcessing && (
              <div className="py-12 text-center">
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Processing Receipt...</h3>
                <p className="text-gray-600">Using AI to detect items and estimate expiration dates</p>
              </div>
            )}

            {!isProcessing && scannedItems.length > 0 && (
              <div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 text-green-800">
                    <AlertCircle size={20} />
                    <span className="font-semibold">Found {scannedItems.length} food items on your receipt!</span>
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto mb-4 space-y-2">
                  {scannedItems.map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 border">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">{item.name}</h4>
                          <div className="flex gap-3 mt-1 text-sm text-gray-600">
                            <span className="capitalize">{item.category}</span>
                            <span>•</span>
                            <span>{item.quantity} {item.unit}</span>
                            <span>•</span>
                            <span>Expires {item.expirationDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowReceiptScanner(false);
                      setScannedItems([]);
                      setReceiptImage(null);
                      setUploadError(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addScannedItems}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                  >
                    Add All Items
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}