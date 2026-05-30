import { useNavigate } from 'react-router-dom';

const useNavigateBack = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return goBack;
};

export default useNavigateBack;
