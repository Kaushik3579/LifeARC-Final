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
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          setUser(user);
          const primaryDocRef = doc(db, "expenses", user.uid);
          const secondaryDocRef = doc(db, "secondaryExpenses", user.uid);
          const primarySnapshot = await getDoc(primaryDocRef);
          const secondarySnapshot = await getDoc(secondaryDocRef);

          if (primarySnapshot.exists()) {
            setPrimaryExpenses(primarySnapshot.data());
          }
          if (secondarySnapshot.exists()) {
            setSecondaryExpenses(secondarySnapshot.data());
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (user) {
      await setDoc(doc(db, "expenses", user.uid), primaryExpenses, { merge: true });
      await setDoc(doc(db, "secondaryExpenses", user.uid), secondaryExpenses, { merge: true });
    }
    setIsEditing(false);
  };

  const handleChange = (setState) => (field) => (e) => {
    const value = e.target.value;
    setState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="text-center mb-8">
          {user && (
            <>
              <img src={user.photoURL} alt="Profile" className="w-20 h-20 rounded-full mx-auto" />
              <h1 className="text-2xl font-bold text-gray-900 mt-4">{user.displayName}</h1>
            </>
          )}
        </header>

        <Card className="p-6 bg-white shadow-xl rounded-xl">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Primary Expenses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(primaryExpenses).map((key) => (
              <FloatingLabelInput
                key={key}
                label={key.charAt(0).toUpperCase() + key.slice(1)}
                type="number"
                value={primaryExpenses[key]}
                onChange={handleChange(setPrimaryExpenses)(key)}
                disabled={!isEditing}
                className="bg-white text-black mb-4"
              />
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-white shadow-xl rounded-xl">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Secondary Expenses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(secondaryExpenses).map((key) => (
              <FloatingLabelInput
                key={key}
                label={key.charAt(0).toUpperCase() + key.slice(1)}
                type="number"
                value={secondaryExpenses[key]}
                onChange={handleChange(setSecondaryExpenses)(key)}
                disabled={!isEditing}
                className="bg-white text-black mb-4"
              />
            ))}
          </div>
        </Card>

        <div className="flex justify-center mt-8">
          {isEditing ? (
            <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600 text-white">
              Save
            </Button>
          ) : (
            <Button onClick={handleEdit} className="bg-blue-500 hover:bg-blue-600 text-white">
              Edit
            </Button>
          )}
        </div>

        <div className="flex justify-center mt-8">
          <Button onClick={() => navigate("/goal-tracker")} className="bg-blue-500 hover:bg-blue-600 text-white">
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
