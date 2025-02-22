import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, doc, getDoc, setDoc } from "@/firebase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FloatingLabelInput from "@/components/FloatingLabelInput";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [primaryExpenses, setPrimaryExpenses] = useState({});
  const [secondaryExpenses, setSecondaryExpenses] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Use onAuthStateChanged instead of relying on currentUser
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const primaryDocRef = doc(db, "expenses", currentUser.uid);
          const secondaryDocRef = doc(db, "secondaryExpenses", currentUser.uid);
          
          const [primarySnapshot, secondarySnapshot] = await Promise.all([
            getDoc(primaryDocRef),
            getDoc(secondaryDocRef)
          ]);

          // Set default empty objects if data doesn't exist
          setPrimaryExpenses(primarySnapshot.exists() ? primarySnapshot.data() : {});
          setSecondaryExpenses(secondarySnapshot.exists() ? secondarySnapshot.data() : {});
          
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      } else {
        // If no user is authenticated, redirect to login
        navigate("/");
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, [navigate]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      await Promise.all([
        setDoc(doc(db, "expenses", user.uid), primaryExpenses, { merge: true }),
        setDoc(doc(db, "secondaryExpenses", user.uid), secondaryExpenses, { merge: true })
      ]);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (setState) => (field) => (e) => {
    const value = e.target.value;
    setState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center">Error: {error}</div>;
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="text-center mb-8">
          <img src={user.photoURL || "https://via.placeholder.com/150"} alt="Profile" className="w-20 h-20 rounded-full mx-auto" />
          <h1 className="text-2xl font-bold text-gray-900 mt-4">{user.displayName || "User"}</h1>
          <p className="text-sm text-gray-500">{user.email}</p>
        </header>

        <Card className="p-6 bg-white shadow-xl rounded-xl">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Primary Expenses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(primaryExpenses).length > 0 ? (
              Object.keys(primaryExpenses).map((key) => (
                <FloatingLabelInput
                  key={key}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  type="number"
                  value={primaryExpenses[key] || ""}
                  onChange={handleChange(setPrimaryExpenses)(key)}
                  disabled={!isEditing}
                  className="bg-white text-black mb-4"
                />
              ))
            ) : (
              <p className="text-gray-500">No primary expenses recorded yet</p>
            )}
          </div>
        </Card>

        <Card className="p-6 bg-white shadow-xl rounded-xl">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Secondary Expenses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(secondaryExpenses).length > 0 ? (
              Object.keys(secondaryExpenses).map((key) => (
                <FloatingLabelInput
                  key={key}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  type="number"
                  value={secondaryExpenses[key] || ""}
                  onChange={handleChange(setSecondaryExpenses)(key)}
                  disabled={!isEditing}
                  className="bg-white text-black mb-4"
                />
              ))
            ) : (
              <p className="text-gray-500">No secondary expenses recorded yet</p>
            )}
          </div>
        </Card>

        <div className="flex justify-center mt-8 space-x-4">
          {isEditing ? (
            <Button 
              onClick={handleSave} 
              className="bg-green-500 hover:bg-green-600 text-white"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          ) : (
            <Button 
              onClick={handleEdit} 
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Edit
            </Button>
          )}
          <Button 
            onClick={() => navigate("/goal-tracker")} 
            className="bg-gray-500 hover:bg-gray-600 text-white"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;