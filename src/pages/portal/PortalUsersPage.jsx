import MyAccountCard from '../../components/account/MyAccountCard.jsx';
import useAuthStore, { selectCurrentUser, selectCurrentClient } from '../../store/authStore.js';

function PortalUsersPage() {
  const currentUser = useAuthStore(selectCurrentUser);
  const currentClient = useAuthStore(selectCurrentClient);

  return (
    <div style={{ padding: 24, maxWidth: 700 }}>
      <MyAccountCard
        extraItems={[
          { label: 'Linked Client', value: currentUser?.linkedClientNo },
          { label: 'Client Account', value: currentClient?.clientName || currentClient?.clientNo },
        ]}
      />
    </div>
  );
}

export default PortalUsersPage;
