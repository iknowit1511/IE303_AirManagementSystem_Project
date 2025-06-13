package com.ams.airManagement.service.implement;

import com.ams.airManagement.dto.LoginRequestDTO;
import com.ams.airManagement.dto.ResponseDTO;
import com.ams.airManagement.dto.UsersDTO;
import com.ams.airManagement.entity.Users;
import com.ams.airManagement.exception.OurException;
import com.ams.airManagement.repository.UsersRepository;
import com.ams.airManagement.service.interfac.UserServiceInterface;
import com.ams.airManagement.utils.JWTUtils;
import com.ams.airManagement.utils.Utils;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserServiceInterface {

    @Autowired
    private UsersRepository usersRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JWTUtils jwtUtils;
    @Autowired
    private AuthenticationManager authenticationManager;


    @Override
    public ResponseDTO register(Users users) {
        ResponseDTO responseDTO = new ResponseDTO();
        try {
            if (users.getRole() == null || users.getRole().isBlank()) {
                users.setRole("USER");
            }

            if (usersRepository.existsByEmail(users.getEmail())) {
                throw new OurException(users.getEmail() + " already exists!");
            }

            users.setPassword(passwordEncoder.encode(users.getPassword()));
            Users savedUser = usersRepository.save(users);
            UsersDTO usersDTO = Utils.mapUserEntityToUserDTO(savedUser);
            responseDTO.setStatusCode(200);
            responseDTO.setUsersDTO(usersDTO);

        } catch (OurException e) {
            responseDTO.setStatusCode(400);
            responseDTO.setMessage(e.getMessage());
        }
        catch (Exception e) {
            responseDTO.setStatusCode(500);
            responseDTO.setMessage("Error during user registration: " + e.getMessage());
        }
        return responseDTO;
    }

    @Override
    public ResponseDTO login(LoginRequestDTO loginRequest) {
        ResponseDTO responseDTO = new ResponseDTO();
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
            var user = usersRepository.findByEmail(loginRequest.getEmail()).orElseThrow(() -> new OurException("User not found!"));

            var token = jwtUtils.generateToken(user);
            responseDTO.setStatusCode(200);
            responseDTO.setToken(token);
            responseDTO.setRole(user.getRole());
            responseDTO.setExpirationTime("1 day");
            responseDTO.setMessage("Successful!");

        } catch (OurException e){
            responseDTO.setStatusCode(400);
            responseDTO.setMessage(e.getMessage());
        }
        catch (Exception e) {
            responseDTO.setStatusCode(500);
            responseDTO.setMessage("Error during user login: " + e.getMessage());
        }
        return responseDTO;
    }

    @Override
    public ResponseDTO getAllUsers() {
        ResponseDTO responseDTO = new ResponseDTO();
        try {
            List<Users> usersList = usersRepository.findAll();
            List<UsersDTO> usersDTOList = Utils.mapUserListEntityToUserListDTO(usersList);
            responseDTO.setStatusCode(200);
            responseDTO.setMessage("Successful!");
            responseDTO.setUserList(usersDTOList);

        } catch (Exception e) {
            responseDTO.setStatusCode(500);
            responseDTO.setMessage("Error getting all users: " + e.getMessage());
        }
        return responseDTO;
    }

    @Override
    public ResponseDTO getUserById(Integer userId) {
        ResponseDTO responseDTO = new ResponseDTO();
        try {
            Users users = usersRepository.findById(userId).orElseThrow(() -> new OurException("User not found!"));
            UsersDTO usersDTO = Utils.mapUserEntityToUserDTO(users);
            responseDTO.setStatusCode(200);
            responseDTO.setMessage("Successful!");
            responseDTO.setUsersDTO(usersDTO);
        } catch (OurException e) {
            responseDTO.setStatusCode(400);
            responseDTO.setMessage(e.getMessage());
        }
        catch (Exception e) {
            responseDTO.setStatusCode(500);
            responseDTO.setMessage("Error get user by ID: " + e.getMessage());
        }
        return responseDTO;
    }

    @Override
    public ResponseDTO getUserByEmail(String email) {
        ResponseDTO responseDTO = new ResponseDTO();
        try {
            Users users = usersRepository.findByEmail(email).orElseThrow(() -> new OurException("User not found!"));
            UsersDTO usersDTO = Utils.mapUserEntityToUserDTO(users);
            responseDTO.setStatusCode(200);
            responseDTO.setMessage("Successful!");
            responseDTO.setUsersDTO(usersDTO);
        } catch (OurException e) {
            responseDTO.setStatusCode(400);
            responseDTO.setMessage(e.getMessage());
        }
        catch (Exception e) {
            responseDTO.setStatusCode(500);
            responseDTO.setMessage("Error get user by Email: " + e.getMessage());
        }
        return responseDTO;
    }

    @Override
    public ResponseDTO deleteUser(Integer userId) {
        ResponseDTO responseDTO = new ResponseDTO();
        try {
            usersRepository.findById(userId).orElseThrow(() -> new OurException("User not found!"));
            usersRepository.deleteById(userId);
            responseDTO.setStatusCode(200);
            responseDTO.setMessage("Successful!");
        } catch (OurException e) {
            responseDTO.setStatusCode(400);
            responseDTO.setMessage(e.getMessage());
        }
        catch (Exception e) {
            responseDTO.setStatusCode(500);
            responseDTO.setMessage("Error deleting user: " + e.getMessage());
        }
        return responseDTO;
    }

    @Override
    @Transactional
    public ResponseDTO updateUser(Integer userId, UsersDTO updateUserDTO) {
        ResponseDTO responseDTO = new ResponseDTO();
        try {
            Users users = usersRepository.findById(userId).orElseThrow(() -> new OurException("User not found!"));

            boolean isUpdated = false; // Theo dõi xem có thay đổi nào không
            if (updateUserDTO.getName() != null && !updateUserDTO.getName().equals(users.getName())) {
                users.setName(updateUserDTO.getName());
                isUpdated = true;
            }
            if (updateUserDTO.getAddress() != null && !updateUserDTO.getAddress().equals(users.getAddress())) {
                users.setAddress(updateUserDTO.getAddress());
                isUpdated = true;
            }
            if (updateUserDTO.getPhone() != null && !updateUserDTO.getPhone().equals(users.getPhone())) {
                users.setPhone(updateUserDTO.getPhone());
                isUpdated = true;
            }



            if (isUpdated) {
                Users updatedUser = usersRepository.save(users);
                UsersDTO responseUserDTO = Utils.mapUserEntityToUserDTO(updatedUser);
                responseDTO.setStatusCode(200);
                responseDTO.setMessage("User updated successfully!");
                responseDTO.setUsersDTO(responseUserDTO);
            } else {
                responseDTO.setStatusCode(200);
                responseDTO.setMessage("No changes to update.");
                responseDTO.setUsersDTO(Utils.mapUserEntityToUserDTO(users));
            }
        } catch (OurException e) {
            responseDTO.setStatusCode(400);
            responseDTO.setMessage(e.getMessage());
        }
        catch (Exception e) {
            responseDTO.setStatusCode(500);
            responseDTO.setMessage("Error updating user: " + e.getMessage());
        }
        return responseDTO;
    }

    @Override
    public ResponseDTO getMyInfo(String email) {
        ResponseDTO responseDTO = new ResponseDTO();
        try {
            Users users = usersRepository.findByEmail(email).orElseThrow(() -> new OurException("User not found!"));
            UsersDTO usersDTO = Utils.mapUserEntityToUserDTO(users);

            responseDTO.setStatusCode(200);
            responseDTO.setMessage("Successful!");
            responseDTO.setUsersDTO(usersDTO);
        } catch (OurException e) {
            responseDTO.setStatusCode(400);
            responseDTO.setMessage(e.getMessage());
        }
        catch (Exception e) {
            responseDTO.setStatusCode(500);
            responseDTO.setMessage("Error getting user info: " + e.getMessage());
        }
        return responseDTO;
    }

    @Override
    public ResponseDTO getUserBooking(Integer userId) {
        ResponseDTO responseDTO = new ResponseDTO();
        try {
            Users users = usersRepository.findById(userId).orElseThrow(() -> new OurException("User not found!"));
            UsersDTO usersDTO = Utils.mapUserEntityToUserDTOAndBooking(users);

            responseDTO.setStatusCode(200);
            responseDTO.setMessage("Successful!");
            responseDTO.setUsersDTO(usersDTO);
        } catch (OurException e) {
            responseDTO.setStatusCode(400);
            responseDTO.setMessage(e.getMessage());
        }
        catch (Exception e) {
            responseDTO.setStatusCode(500);
            responseDTO.setMessage("Error getting user booking: " + e.getMessage());
        }
        return responseDTO;
    }

    @Override
    @Transactional
    public ResponseDTO changePassword(Integer userId, String oldPassword, String newPassword) {
        ResponseDTO responseDTO = new ResponseDTO();
        try {
            Users users = usersRepository.findById(userId)
                    .orElseThrow(() -> new OurException("User not found!"));


            if (!passwordEncoder.matches(oldPassword, users.getPassword())) {
                throw new OurException("Old password is incorrect!");
            }

            // Validation mật khẩu mới (tùy chọn)
            if (newPassword == null || newPassword.length() < 6) {
                throw new OurException("New password must be at least 6 characters!");
            }

            System.out.println("Encoding new password"); // Log debug
            users.setPassword(passwordEncoder.encode(newPassword));

            System.out.println("Saving user: " + users); // Log trước khi lưu
            Users updatedUser = usersRepository.saveAndFlush(users);
            System.out.println("Saved user: " + updatedUser); // Log sau khi lưu

            responseDTO.setStatusCode(200);
            responseDTO.setMessage("Password changed successfully!");

        } catch (OurException e) {
            responseDTO.setStatusCode(400);
            responseDTO.setMessage(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace(); // In chi tiết lỗi
            responseDTO.setStatusCode(500);
            responseDTO.setMessage("Error changing password: " + e.getMessage());
        }
        return responseDTO;
    }


}
