import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { auth, db, doc, getDoc } from "@/firebase"; // Import Firebase
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState({
    income: "",
    housing: "",
    electricity: "",
    water: "",
    gas: "",
    mobile: "",
    insurance: "",
    loans: "",
    provident: "",
    education: "",
    medication: "",
    groceries: "",
    secondaryExpenses: {} // Ensure secondaryExpenses is always an object
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          setUser(user);
          const docRef = doc(db, "expenses", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfileData(docSnap.data());
          }

          const secondaryDocRef = doc(db, "secondaryExpenses", user.uid);
          const secondaryDocSnap = await getDoc(secondaryDocRef);
          if (secondaryDocSnap.exists()) {
            setProfileData(prevData => ({
              ...prevData,
              secondaryExpenses: secondaryDocSnap.data() || {} // Ensure secondaryExpenses is always an object
            }));
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
            <div>
              <p className="text-sm text-gray-500">Monthly Income</p>
              <p className="text-lg font-medium text-gray-900">{profileData.income}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Housing</p>
              <p className="text-lg font-medium text-gray-900">{profileData.housing}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Electricity</p>
              <p className="text-lg font-medium text-gray-900">{profileData.electricity}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Water</p>
              <p className="text-lg font-medium text-gray-900">{profileData.water}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Gas</p>
              <p className="text-lg font-medium text-gray-900">{profileData.gas}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Mobile</p>
              <p className="text-lg font-medium text-gray-900">{profileData.mobile}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Insurance</p>
              <p className="text-lg font-medium text-gray-900">{profileData.insurance}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Loans</p>
              <p className="text-lg font-medium text-gray-900">{profileData.loans}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Provident Fund</p>
              <p className="text-lg font-medium text-gray-900">{profileData.provident}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Education</p>
              <p className="text-lg font-medium text-gray-900">{profileData.education}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Medication</p>
              <p className="text-lg font-medium text-gray-900">{profileData.medication}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Groceries</p>
              <p className="text-lg font-medium text-gray-900">{profileData.groceries}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white shadow-xl rounded-xl">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Secondary Expenses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profileData.secondaryExpenses && Object.entries(profileData.secondaryExpenses).map(([key, value]) => (
              <div key={key}>
                <p className="text-sm text-gray-500">{key}</p>
                <p className="text-lg font-medium text-gray-900">{value}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="flex justify-center mt-8"></div>
          <Button onClick={() => navigate("/goal-tracker")} className="bg-blue-500 hover:bg-blue-600 text-white">
            Back to Dashboard
          </Button>
        </div>
      </div>
    
  );
};

export default Profile;
