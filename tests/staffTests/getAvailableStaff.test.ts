import { GetAvailableStaff } from "../../src/application/staff/getAvailableStaff";
import { Staff } from "../../src/domain/staff";
import { StaffRole } from "../../src/domain/types";
import { StaffRepository } from "../../src/infrastructure/repositories/staffRepository";

describe("GetAvailableStaff", () => {
    let staffRepositoryMock: jest.Mocked<StaffRepository>;
    let getAvailableStaff: GetAvailableStaff;

    beforeEach(() => {
        // Mock the StaffRepository
        staffRepositoryMock = {
            addStaff: jest.fn(),
            removeStaff: jest.fn(),
            updateStaff: jest.fn(),
            getAllStaffs: jest.fn(),
            getStaffsByRole: jest.fn(),
            getStaffById: jest.fn(),
            getAvailableStaff: jest.fn(),
        } as unknown as jest.Mocked<StaffRepository>;

        // Initialize GetAvailableStaff with the mocked repository
        getAvailableStaff = new GetAvailableStaff(staffRepositoryMock);
    });

    it("should return available staff when they exist", () => {
        const mockStaff: Staff[] = [
            { staffId: "1", available: true, staffRole: StaffRole.Cook},
            { staffId: "2", available: true, staffRole: StaffRole.Cleaner},
        ];

        // Mock the available staff to be returned from the repository
        staffRepositoryMock.getAvailableStaff.mockReturnValue(mockStaff);

        // Execute the method
        const result = getAvailableStaff.execute();

        // Verify that getAvailableStaff was called
        expect(staffRepositoryMock.getAvailableStaff).toHaveBeenCalled();

        // Check if the correct staff members are returned
        expect(result).toEqual(mockStaff);
    });

    it("should return an empty array if no available staff exists", () => {
        // Mock the available staff to return an empty array from the repository
        staffRepositoryMock.getAvailableStaff.mockReturnValue([]);

        // Execute the method
        const result = getAvailableStaff.execute();

        // Verify that getAvailableStaff was called
        expect(staffRepositoryMock.getAvailableStaff).toHaveBeenCalled();

        // Check that the result is an empty array
        expect(result).toEqual([]);
    });
});
