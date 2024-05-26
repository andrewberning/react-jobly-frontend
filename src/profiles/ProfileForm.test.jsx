import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProfileForm from './ProfileForm';
import { UserProvider } from "../testUtils";
import JoblyApi from '../api/api';

// Mock the Alert component
vi.mock('../components/Alert', () => ({
  __esModule: true,
  default: ({ type, messages }) => (
    <div data-testid={`alert-${type}`}>{messages.join(' ')}</div>
  ),
}));

// Mock the JoblyApi
vi.mock('../api/api', () => ({
  __esModule: true,
  default: {
    saveProfile: vi.fn(),
  },
}));

describe('ProfileForm', () => {

  const setCurrentUser = vi.fn();

  const renderProfileForm = (currentUser) =>
    render(
      <UserProvider currentUser={currentUser} setCurrentUser={setCurrentUser}>
        <ProfileForm />
      </UserProvider>
    );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("matches snapshot", function () {
    const { asFragment } = render(
      <UserProvider>
        <ProfileForm />
      </UserProvider>,
    );
    expect(asFragment()).toMatchSnapshot();
  })

  it('renders the form with user data', () => {
    renderProfileForm();
    
    expect(screen.getByDisplayValue('testfirst')).toBeInTheDocument();
    expect(screen.getByDisplayValue('testlast')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test@test.net')).toBeInTheDocument();
    expect(screen.getByText('testuser')).toBeInTheDocument();
  });

  it('handles input changes', () => {
    renderProfileForm();
    
    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { value: 'Jane' },
    });
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { value: 'Smith' },
    });

    expect(screen.getByDisplayValue('Jane')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Smith')).toBeInTheDocument();
  });

  it('submits the form successfully', async () => {
    JoblyApi.saveProfile.mockResolvedValueOnce({
      username: 'testuser',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'test@test.net',
      photo_url: null,
    });

    renderProfileForm();

    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { value: 'Jane' },
    });
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { value: 'Smith' },
    });
    fireEvent.change(screen.getByLabelText(/Confirm password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByText(/Save Changes/i));

    await waitFor(() => {
      expect(JoblyApi.saveProfile).toHaveBeenCalledWith('testuser', {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'test@test.net',
        password: 'password123',
      });
      expect(screen.getByTestId('alert-success')).toBeInTheDocument();
    });

    expect(setCurrentUser).toHaveBeenCalledWith({
      username: 'testuser',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'test@test.net',
      photo_url: null,
    });
  });

  it('handles form submission errors', async () => {
    JoblyApi.saveProfile.mockRejectedValueOnce(new Error('Error updating profile'));

    renderProfileForm();

    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { value: 'Jane' },
    });
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { value: 'Smith' },
    });
    fireEvent.change(screen.getByLabelText(/Confirm password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByText(/Save Changes/i));

    await waitFor(() => {
      expect(JoblyApi.saveProfile).toHaveBeenCalledWith('testuser', {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'test@test.net',
        password: 'password123',
      });
      expect(screen.getByTestId('alert-danger')).toBeInTheDocument();
    });

    expect(setCurrentUser).not.toHaveBeenCalled();
  });
});
