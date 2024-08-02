import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FilterPanel = ({ onFilterChange }) => {
    const [filters, setFilters] = useState({
        modelYear: '',
        make: '',
        model: '',
        vehicleClass: '',
    });

    const [options, setOptions] = useState({
        modelYear: [],
        make: [],
        model: [],
        vehicleClass: [],
    });

    const [selectedVehicles, setSelectedVehicles] = useState([]);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await axios.get('/api/filter-options');
                const data = response.data;
                setOptions({
                    modelYear: data.modelYear || [],
                    make: data.make || [],
                    model: data.model || [],
                    vehicleClass: data.vehicleClass || [],
                });
            } catch (error) {
                console.error('Error fetching filter options:', error);
            }
        };
        fetchOptions();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };

    const handleAddVehicle = () => {
        if (filters.modelYear && filters.make && filters.model && filters.vehicleClass) {
            setSelectedVehicles(prev => [...prev, filters]);
            setFilters({
                modelYear: '',
                make: '',
                model: '',
                vehicleClass: '',
            });
        }
    };

    const handleRemoveVehicle = (index) => {
        setSelectedVehicles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onFilterChange(filters);
    };

    const handleCompare = () => {
        onFilterChange(selectedVehicles);
    };

    const resetFilters = () => {
        setFilters({
            modelYear: '',
            make: '',
            model: '',
            vehicleClass: '',
        });
        onFilterChange({});
    };

    return (
        <form onSubmit={handleSubmit} className="filter-panel">
            <div className="filter-panel">
                <div>
                    <select name="modelYear" value={filters.modelYear} onChange={handleChange}>
                        <option value="">Select Year</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                        {options.modelYear.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>

                    <select name="make" value={filters.make} onChange={handleChange}>
                        <option value="">Select Make</option>
                        <option value="Acura">Acura</option>
                        <option value="Alfa Romeo">Alfa Romeo</option>
                        <option value="Aston Martin">Aston Martin</option>
                        <option value="Audi">Audi</option>
                        <option value="Bentley">Bentley</option>
                        <option value="BMW">BMW</option>
                        <option value="Bugatti">Bugatti</option>
                        <option value="Buick">Buick</option>
                        <option value="Cadillac">Cadillac</option>
                        <option value="Chevrolet">Chevrolet</option>
                        <option value="Chrysler">Chrysler</option>
                        <option value="Dodge">Dodge</option>
                        <option value="Ferrari">Ferrari</option>
                        <option value="Ford">Ford</option>
                        <option value="Genesis">Genesis</option>
                        <option value="GMC">GMC</option>
                        <option value="Honda">Honda</option>
                        <option value="Hyundai">Hyundai</option>
                        <option value="Infiniti">Infiniti</option>
                        <option value="Jaguar">Jaguar</option>
                        <option value="Jeep">Jeep</option>
                        <option value="Kia">Kia</option>
                        <option value="Lamborghini">Lamborghini</option>
                        <option value="Land Rover">Land Rover</option>
                        <option value="Lexus">Lexus</option>
                        <option value="Lincoln">Lincoln</option>
                        <option value="Maserati">Maserati</option>
                        <option value="Mazda">Mazda</option>
                        <option value="Mercedes-Benz">Mercedes-Benz</option>
                        <option value="MINI">MINI</option>
                        <option value="Mitsubishi">Mitsubishi</option>
                        <option value="Nissan">Nissan</option>
                        <option value="Porsche">Porsche</option>
                        <option value="Ram">Ram</option>
                        <option value="Rolls-Royce">Rolls-Royce</option>
                        <option value="Subaru">Subaru</option>
                        <option value="Toyota">Toyota</option>
                        <option value="Volkswagen">Volkswagen</option>
                        <option value="Volvo">Volvo</option>
                        {options.make.map(make => (
                            <option key={make} value={make}>{make}</option>
                        ))}
                    </select>

                    <select name="model" value={filters.model} onChange={handleChange}>
                        <option value="">Select Model</option>
                        <option value="1500 4X4 eTorque">1500 4X4 eTorque</option>
                        <option value="1500 4X4 TRX">1500 4X4 TRX</option>
                        <option value="1500 eTorque">1500 eTorque</option>
                        <option value="230i xDrive Coupe">230i xDrive Coupe</option>
                        <option value="330i xDrive Sedan">330i xDrive Sedan</option>
                        <option value="430i xDrive Cabriolet">430i xDrive Cabriolet</option>
                        <option value="430i xDrive Coupe">430i xDrive Coupe</option>
                        <option value="4Runner 4WD">4Runner 4WD</option>
                        <option value="4Runner 4WD (Part-Time 4WD)">4Runner 4WD (Part-Time 4WD)</option>
                        <option value="530i xDrive Sedan">530i xDrive Sedan</option>
                        <option value="718 Boxster">718 Boxster</option>
                        <option value="718 Boxster GTS 4.0">718 Boxster GTS 4.0</option>
                        <option value="718 Boxster S">718 Boxster S</option>
                        <option value="718 Cayman">718 Cayman</option>
                        <option value="718 Cayman GTS 4.0">718 Cayman GTS 4.0</option>
                        <option value="718 Cayman S">718 Cayman S</option>
                        <option value="718 GT4 RS">718 GT4 RS</option>
                        <option value="760i xDrive Sedan">760i xDrive Sedan</option>
                        <option value="812 Competizione">812 Competizione</option>
                        <option value="812 Competizione A">812 Competizione A</option>
                        <option value="911 Carrera">911 Carrera</option>
                        <option value="911 Carrera 4">911 Carrera 4</option>
                        <option value="911 Carrera 4 Cabriolet">911 Carrera 4 Cabriolet</option>
                        <option value="911 Carrera 4 GTS">911 Carrera 4 GTS</option>
                        <option value="911 Carrera 4 GTS Cabriolet">911 Carrera 4 GTS Cabriolet</option>
                        <option value="911 Carrera 4S">911 Carrera 4S</option>
                        <option value="911 Carrera 4S Cabriolet">911 Carrera 4S Cabriolet</option>
                        <option value="911 Carrera Cabriolet">911 Carrera Cabriolet</option>
                        <option value="911 Carrera GTS">911 Carrera GTS</option>
                        <option value="911 Carrera GTS Cabriolet">911 Carrera GTS Cabriolet</option>
                        <option value="911 Carrera S">911 Carrera S</option>
                        <option value="911 Carrera S Cabriolet">911 Carrera S Cabriolet</option>
                        <option value="911 Carrera T">911 Carrera T</option>
                        <option value="911 Dakar">911 Dakar</option>
                        <option value="911 GT3">911 GT3</option>
                        <option value="911 GT3 RS">911 GT3 RS</option>
                        <option value="911 GT3 Touring">911 GT3 Touring</option>
                        <option value="911 Targa 4">911 Targa 4</option>
                        <option value="911 Targa 4 GTS">911 Targa 4 GTS</option>
                        <option value="911 Targa 4S">911 Targa 4S</option>
                        <option value="911 Turbo">911 Turbo</option>
                        <option value="911 Turbo Cabriolet">911 Turbo Cabriolet</option>
                        <option value="911 Turbo S">911 Turbo S</option>
                        <option value="911 Turbo S Cabriolet">911 Turbo S Cabriolet</option>
                        <option value="A3 40 TFSI quattro">A3 40 TFSI quattro</option>
                        <option value="A4 45 TFSI quattro">A4 45 TFSI quattro</option>
                        <option value="A4 allroad 45 TFSI quattro">A4 allroad 45 TFSI quattro</option>
                        <option value="A5 Cabriolet 45 TFSI quattro">A5 Cabriolet 45 TFSI quattro</option>
                        <option value="A5 Coup� 45 TFSI quattro">A5 Coup� 45 TFSI quattro</option>
                        <option value="A5 Sportback 45 TFSI quattro">A5 Sportback 45 TFSI quattro</option>
                        <option value="A6 45 TFSI quattro">A6 45 TFSI quattro</option>
                        <option value="A6 55 TFSI quattro">A6 55 TFSI quattro</option>
                        <option value="A6 allroad 55 TFSI quattro">A6 allroad 55 TFSI quattro</option>
                        <option value="A7 Sportback 55 TFSI quattro">A7 Sportback 55 TFSI quattro</option>
                        <option value="A8 L 55 TFSI quattro">A8 L 55 TFSI quattro</option>
                        <option value="Acadia AWD">Acadia AWD</option>
                        <option value="Accord">Accord</option>
                        <option value="Accord Hybrid Sport/Touring">Accord Hybrid Sport/Touring</option>
                        <option value="ALPINA B8 Gran Coupe">ALPINA B8 Gran Coupe</option>
                        <option value="ALPINA XB7">ALPINA XB7</option>
                        <option value="Altima AWD">Altima AWD</option>
                        <option value="Altima AWD SR/Platinum">Altima AWD SR/Platinum</option>
                        <option value="AMG C 43 4MATIC Sedan">AMG C 43 4MATIC Sedan</option>
                        <option value="AMG CLA 35 4MATIC Coupe">AMG CLA 35 4MATIC Coupe</option>
                        <option value="AMG CLA 45 S 4MATIC Coupe">AMG CLA 45 S 4MATIC Coupe</option>
                        <option value="AMG CLE 53 4MATIC+ Coupe">AMG CLE 53 4MATIC+ Coupe</option>
                        <option value="AMG G 63 4x4 Squared SUV">AMG G 63 4x4 Squared SUV</option>
                        <option value="AMG G 63 SUV">AMG G 63 SUV</option>
                        <option value="AMG GLB 35 4MATIC Coupe">AMG GLB 35 4MATIC Coupe</option>
                        <option value="AMG GLC 43 4MATIC Coupe">AMG GLC 43 4MATIC Coupe</option>
                        <option value="AMG GLC 43 4MATIC+ SUV">AMG GLC 43 4MATIC+ SUV</option>
                        <option value="AMG GLE 53 4MATIC+ Coupe">AMG GLE 53 4MATIC+ Coupe</option>
                        <option value="AMG GLE 53 4MATIC+ SUV">AMG GLE 53 4MATIC+ SUV</option>
                        <option value="AMG GLE 63 S 4MATIC+ Coupe">AMG GLE 63 S 4MATIC+ Coupe</option>
                        <option value="AMG GLE 63 S 4MATIC+ SUV">AMG GLE 63 S 4MATIC+ SUV</option>
                        <option value="AMG GLS 63 4MATIC+ SUV">AMG GLS 63 4MATIC+ SUV</option>
                        <option value="AMG GT 53 4MATIC+ ">AMG GT 53 4MATIC+ </option>
                        <option value="AMG GT 55 4MATIC+ Coupe">AMG GT 55 4MATIC+ Coupe</option>
                        <option value="AMG GT 63 4MATIC+ ">AMG GT 63 4MATIC+ </option>
                        <option value="AMG GT 63 4MATIC+ Coupe">AMG GT 63 4MATIC+ Coupe</option>
                        <option value="AMG SL 55 4MATIC+ Roadster">AMG SL 55 4MATIC+ Roadster</option>
                        <option value="AMG SL 63 4MATIC+ Roadster">AMG SL 63 4MATIC+ Roadster</option>
                        <option value="Armada 4WD">Armada 4WD</option>
                        <option value="Ascent AWD">Ascent AWD</option>
                        <option value="Atlas 4MOTION Comfortline">Atlas 4MOTION Comfortline</option>
                        <option value="Atlas 4MOTION Highline/Execline">Atlas 4MOTION Highline/Execline</option>
                        <option value="Atlas 4MOTION Peak Edition">Atlas 4MOTION Peak Edition</option>
                        <option value="Atlas Cross Sport 4MOTION">Atlas Cross Sport 4MOTION</option>
                        <option value="Aviator AWD">Aviator AWD</option>
                        <option value="Bentayga">Bentayga</option>
                        <option value="Bentayga EWB">Bentayga EWB</option>
                        <option value="Blazer AWD">Blazer AWD</option>
                        <option value="Bronco 4WD">Bronco 4WD</option>
                        <option value="Bronco Badlands 4WD">Bronco Badlands 4WD</option>
                        <option value="Bronco Black Diamond 4WD">Bronco Black Diamond 4WD</option>
                        <option value="Bronco Raptor 4WD">Bronco Raptor 4WD</option>
                        <option value="Bronco Sasquatch 4WD">Bronco Sasquatch 4WD</option>
                        <option value="Bronco Sport 4WD">Bronco Sport 4WD</option>
                        <option value="BRZ">BRZ</option>
                        <option value="C 300 4MATIC Sedan">C 300 4MATIC Sedan</option>
                        <option value="Camaro">Camaro</option>
                        <option value="Camaro SS">Camaro SS</option>
                        <option value="Camaro ZL1">Camaro ZL1</option>
                        <option value="Camry AWD SE">Camry AWD SE</option>
                        <option value="Camry AWD XSE">Camry AWD XSE</option>
                        <option value="Camry Hybrid LE">Camry Hybrid LE</option>
                        <option value="Camry Hybrid SE/XLE/XSE">Camry Hybrid SE/XLE/XSE</option>
                        <option value="Camry SE">Camry SE</option>
                        <option value="Camry XSE V6/TRD">Camry XSE V6/TRD</option>
                        <option value="Canyon">Canyon</option>
                        <option value="Canyon 4WD">Canyon 4WD</option>
                        <option value="Canyon 4WD Mud Terrain Tire">Canyon 4WD Mud Terrain Tire</option>
                        <option value="Canyon AT4X 4WD">Canyon AT4X 4WD</option>
                        <option value="Canyon AT4X AEV 4WD">Canyon AT4X AEV 4WD</option>
                        <option value="Carnival">Carnival</option>
                        <option value="Cayenne">Cayenne</option>
                        <option value="Cayenne Coupe">Cayenne Coupe</option>
                        <option value="Cayenne S">Cayenne S</option>
                        <option value="Cayenne S Coupe">Cayenne S Coupe</option>
                        <option value="Cayenne Turbo GT Coupe">Cayenne Turbo GT Coupe</option>
                        <option value="Chiron Super Sport">Chiron Super Sport</option>
                        <option value="Civic Hatchback">Civic Hatchback</option>
                        <option value="Civic Sedan">Civic Sedan</option>
                        <option value="Civic Sedan Si">Civic Sedan Si</option>
                        <option value="Civic Type R">Civic Type R</option>
                        <option value="CLA 250 4MATIC Coupe">CLA 250 4MATIC Coupe</option>
                        <option value="CLE 300 4MATIC Cabriolet">CLE 300 4MATIC Cabriolet</option>
                        <option value="CLE 300 4MATIC Coupe">CLE 300 4MATIC Coupe</option>
                        <option value="Colorado">Colorado</option>
                        <option value="Colorado (Turbo Plus)">Colorado (Turbo Plus)</option>
                        <option value="Colorado 4WD">Colorado 4WD</option>
                        <option value="Colorado 4WD (Turbo Plus)">Colorado 4WD (Turbo Plus)</option>
                        <option value="Colorado 4WD Mud Terrain Tire (Turbo Plus)">Colorado 4WD Mud Terrain Tire (Turbo Plus)</option>
                        <option value="Colorado ZR2 4WD (Turbo Plus)">Colorado ZR2 4WD (Turbo Plus)</option>
                        <option value="Colorado ZR2 Bison 4WD (Turbo Plus)">Colorado ZR2 Bison 4WD (Turbo Plus)</option>
                        <option value="Compass 4X4">Compass 4X4</option>
                        <option value="Continental GT">Continental GT</option>
                        <option value="Continental GT Convertible">Continental GT Convertible</option>
                        <option value="Cooper 3 Door">Cooper 3 Door</option>
                        <option value="Cooper 5 Door">Cooper 5 Door</option>
                        <option value="Cooper Convertible">Cooper Convertible</option>
                        <option value="Cooper Countryman ALL4">Cooper Countryman ALL4</option>
                        <option value="Cooper S 3 Door">Cooper S 3 Door</option>
                        <option value="Cooper S 5 Door">Cooper S 5 Door</option>
                        <option value="Cooper S Convertible">Cooper S Convertible</option>
                        <option value="Cooper S Countryman ALL4">Cooper S Countryman ALL4</option>
                        <option value="Corolla (1-mode)">Corolla (1-mode)</option>
                        <option value="Corolla (3-mode)">Corolla (3-mode)</option>
                        <option value="Corolla Cross">Corolla Cross</option>
                        <option value="Corolla Cross AWD">Corolla Cross AWD</option>
                        <option value="Corolla Cross Hybrid AWD">Corolla Cross Hybrid AWD</option>
                        <option value="Corolla Hatchback">Corolla Hatchback</option>
                        <option value="Corolla Hybrid">Corolla Hybrid</option>
                        <option value="Corolla Hybrid AWD (2-mode)">Corolla Hybrid AWD (2-mode)</option>
                        <option value="Corolla Hybrid AWD (3-mode)">Corolla Hybrid AWD (3-mode)</option>
                        <option value="Corsair AWD">Corsair AWD</option>
                        <option value="Corvette">Corvette</option>
                        <option value="Corvette E-Ray">Corvette E-Ray</option>
                        <option value="Corvette Z06">Corvette Z06</option>
                        <option value="Corvette Z06 Carbon Aero">Corvette Z06 Carbon Aero</option>
                        <option value="Crosstrek AWD">Crosstrek AWD</option>
                        <option value="Crosstrek Wilderness AWD">Crosstrek Wilderness AWD</option>
                        <option value="Crown AWD">Crown AWD</option>
                        <option value="CR-V">CR-V</option>
                        <option value="CR-V AWD">CR-V AWD</option>
                        <option value="CR-V Hybrid AWD">CR-V Hybrid AWD</option>
                        <option value="CT4">CT4</option>
                        <option value="CT4 AWD">CT4 AWD</option>
                        <option value="CT4-V">CT4-V</option>
                        <option value="CT4-V AWD">CT4-V AWD</option>
                        <option value="CT5">CT5</option>
                        <option value="CT5 AWD">CT5 AWD</option>
                        <option value="CT5-V">CT5-V</option>
                        <option value="CT5-V AWD">CT5-V AWD</option>
                        <option value="Cullinan">Cullinan</option>
                        <option value="Cullinan Black Badge">Cullinan Black Badge</option>
                        <option value="CX-30 4WD">CX-30 4WD</option>
                        <option value="CX-30 Turbo 4WD">CX-30 Turbo 4WD</option>
                        <option value="CX-5 4WD">CX-5 4WD</option>
                        <option value="CX-5 4WD (Cylinder Deactivation)">CX-5 4WD (Cylinder Deactivation)</option>
                        <option value="CX-5 Turbo 4WD">CX-5 Turbo 4WD</option>
                        <option value="CX-50 4WD">CX-50 4WD</option>
                        <option value="CX-50 Turbo 4WD">CX-50 Turbo 4WD</option>
                        <option value="CX-90 4WD">CX-90 4WD</option>
                        <option value="CX-90 4WD (High Power)">CX-90 4WD (High Power)</option>
                        <option value="Daytona SP3">Daytona SP3</option>
                        <option value="DB12">DB12</option>
                        <option value="DBS V12">DBS V12</option>
                        <option value="DBX V8">DBX V8</option>
                        <option value="DBX707">DBX707</option>
                        <option value="Defender 110 P300">Defender 110 P300</option>
                        <option value="Defender 110 P400">Defender 110 P400</option>
                        <option value="Defender 110 V8 P500/P525">Defender 110 V8 P500/P525</option>
                        <option value="Defender 130 Outbound">Defender 130 Outbound</option>
                        <option value="Defender 130 P300">Defender 130 P300</option>
                        <option value="Defender 130 P400">Defender 130 P400</option>
                        <option value="Defender 90 P300">Defender 90 P300</option>
                        <option value="Defender 90 P400">Defender 90 P400</option>
                        <option value="Defender 90 V8">Defender 90 V8</option>
                        <option value="Discovery P300">Discovery P300</option>
                        <option value="Discovery Sport P250">Discovery Sport P250</option>
                        <option value="Durango AWD">Durango AWD</option>
                        <option value="Durango AWD SRT">Durango AWD SRT</option>
                        <option value="Durango AWD SRT Hellcat">Durango AWD SRT Hellcat</option>
                        <option value="E 350 4MATIC Sedan">E 350 4MATIC Sedan</option>
                        <option value="E 450 4MATIC Sedan">E 450 4MATIC Sedan</option>
                        <option value="Eclipse Cross 4WD">Eclipse Cross 4WD</option>
                        <option value="Edge AWD">Edge AWD</option>
                        <option value="Elantra">Elantra</option>
                        <option value="Elantra (Stop/Start)">Elantra (Stop/Start)</option>
                        <option value="Elantra Hybrid">Elantra Hybrid</option>
                        <option value="Elantra N">Elantra N</option>
                        <option value="Enclave AWD">Enclave AWD</option>
                        <option value="Encore GX">Encore GX</option>
                        <option value="Encore GX AWD">Encore GX AWD</option>
                        <option value="Envision AWD">Envision AWD</option>
                        <option value="Envista">Envista</option>
                        <option value="E-PACE P250">E-PACE P250</option>
                        <option value="Equinox">Equinox</option>
                        <option value="Equinox AWD">Equinox AWD</option>
                        <option value="ES 250 AWD">ES 250 AWD</option>
                        <option value="ES 300h">ES 300h</option>
                        <option value="ES 350">ES 350</option>
                        <option value="ES 350 F SPORT">ES 350 F SPORT</option>
                        <option value="Escalade 4WD">Escalade 4WD</option>
                        <option value="Escalade-V AWD">Escalade-V AWD</option>
                        <option value="Escape">Escape</option>
                        <option value="Escape AWD">Escape AWD</option>
                        <option value="Escape Hybrid">Escape Hybrid</option>
                        <option value="Escape Hybrid AWD">Escape Hybrid AWD</option>
                        <option value="Expedition 4X4">Expedition 4X4</option>
                        <option value="Expedition Timberline 4X4">Expedition Timberline 4X4</option>
                        <option value="Explorer AWD">Explorer AWD</option>
                        <option value="Explorer Timberline AWD">Explorer Timberline AWD</option>
                        <option value="F-150">F-150</option>
                        <option value="F-150 4X4">F-150 4X4</option>
                        <option value="F-150 Hybrid 4X4">F-150 Hybrid 4X4</option>
                        <option value="F-150 Raptor 4X4">F-150 Raptor 4X4</option>
                        <option value="F-150 Raptor R 4X4">F-150 Raptor R 4X4</option>
                        <option value="F-150 Tremor 4X4">F-150 Tremor 4X4</option>
                        <option value="Flying Spur">Flying Spur</option>
                        <option value="Forester AWD">Forester AWD</option>
                        <option value="Forester Wilderness AWD">Forester Wilderness AWD</option>
                        <option value="Forte">Forte</option>
                        <option value="Forte 5">Forte 5</option>
                        <option value="F-PACE P250">F-PACE P250</option>
                        <option value="F-PACE P400">F-PACE P400</option>
                        <option value="F-PACE P550 SVR">F-PACE P550 SVR</option>
                        <option value="Frontier">Frontier</option>
                        <option value="Frontier 4WD">Frontier 4WD</option>
                        <option value="Frontier 4WD Pro-4X">Frontier 4WD Pro-4X</option>
                        <option value="F-TYPE P450 Convertible">F-TYPE P450 Convertible</option>
                        <option value="F-TYPE P450 Convertible AWD">F-TYPE P450 Convertible AWD</option>
                        <option value="F-TYPE P450 Coupe">F-TYPE P450 Coupe</option>
                        <option value="F-TYPE P450 Coupe AWD">F-TYPE P450 Coupe AWD</option>
                        <option value="F-TYPE P575 Convertible AWD">F-TYPE P575 Convertible AWD</option>
                        <option value="F-TYPE P575 Coupe AWD">F-TYPE P575 Coupe AWD</option>
                        <option value="G 550 SUV">G 550 SUV</option>
                        <option value="G70 AWD">G70 AWD</option>
                        <option value="G80 AWD">G80 AWD</option>
                        <option value="G90">G90</option>
                        <option value="Ghibli GT">Ghibli GT</option>
                        <option value="Ghibli Modena">Ghibli Modena</option>
                        <option value="Ghibli Modena AWD">Ghibli Modena AWD</option>
                        <option value="Ghibli Trofeo">Ghibli Trofeo</option>
                        <option value="Ghost">Ghost</option>
                        <option value="Ghost Black Badge">Ghost Black Badge</option>
                        <option value="Ghost Extended">Ghost Extended</option>
                        <option value="Giulia">Giulia</option>
                        <option value="Giulia AWD">Giulia AWD</option>
                        <option value="Giulia Quadrifoglio">Giulia Quadrifoglio</option>
                        <option value="GLA 250 4MATIC SUV">GLA 250 4MATIC SUV</option>
                        <option value="Gladiator 4X4">Gladiator 4X4</option>
                        <option value="GLB 250 4MATIC SUV">GLB 250 4MATIC SUV</option>
                        <option value="GLC 300 4MATIC Coupe">GLC 300 4MATIC Coupe</option>
                        <option value="GLC 300 4MATIC SUV">GLC 300 4MATIC SUV</option>
                        <option value="GLE 350 4MATIC SUV">GLE 350 4MATIC SUV</option>
                        <option value="GLE 450 4MATIC Coupe">GLE 450 4MATIC Coupe</option>
                        <option value="GLS 450 4MATIC SUV">GLS 450 4MATIC SUV</option>
                        <option value="GLS 580 4MATIC SUV">GLS 580 4MATIC SUV</option>
                        <option value="GLS 600 4MATIC Maybach SUV">GLS 600 4MATIC Maybach SUV</option>
                        <option value="Golf GTI">Golf GTI</option>
                        <option value="Golf R">Golf R</option>
                        <option value="GR Corolla">GR Corolla</option>
                        <option value="GR Supra 2.0">GR Supra 2.0</option>
                        <option value="GR Supra 3.0">GR Supra 3.0</option>
                        <option value="GR Supra 3.0">GR Supra 3.0</option>
                        <option value="GR86">GR86</option>
                        <option value="Grand Caravan">Grand Caravan</option>
                        <option value="Grand Cherokee 4X4">Grand Cherokee 4X4</option>
                        <option value="Grand Cherokee L 4X4">Grand Cherokee L 4X4</option>
                        <option value="Grand Highlander AWD Limited">Grand Highlander AWD Limited</option>
                        <option value="Grand Highlander AWD XLE">Grand Highlander AWD XLE</option>
                        <option value="Grand Highlander Hybrid AWD Limited">Grand Highlander Hybrid AWD Limited</option>
                        <option value="Grand Highlander Hybrid AWD XLE">Grand Highlander Hybrid AWD XLE</option>
                        <option value="Grand Highlander Platinum Hybrid MAX AWD">Grand Highlander Platinum Hybrid MAX AWD</option>
                        <option value="Grand Wagoneer 4X4">Grand Wagoneer 4X4</option>
                        <option value="Grand Wagoneer 4X4 (High Output)">Grand Wagoneer 4X4 (High Output)</option>
                        <option value="Grand Wagoneer L 4X4 (High Output)">Grand Wagoneer L 4X4 (High Output)</option>
                        <option value="Granturismo Modena">Granturismo Modena</option>
                        <option value="Granturismo Trofeo">Granturismo Trofeo</option>
                        <option value="Grecale GT">Grecale GT</option>
                        <option value="Grecale Modena">Grecale Modena</option>
                        <option value="Grecale Trofeo">Grecale Trofeo</option>
                        <option value="GT-R">GT-R</option>
                        <option value="GV70 AWD">GV70 AWD</option>
                        <option value="GV80 AWD">GV80 AWD</option>
                        <option value="GX 550">GX 550</option>
                        <option value="Highlander AWD">Highlander AWD</option>
                        <option value="Highlander Hybrid AWD">Highlander Hybrid AWD</option>
                        <option value="Highlander Hybrid AWD Limited/Platinum">Highlander Hybrid AWD Limited/Platinum</option>
                        <option value="Hornet AWD">Hornet AWD</option>
                        <option value="HR-V">HR-V</option>
                        <option value="HR-V AWD">HR-V AWD</option>
                        <option value="Hurac�n EVO Spyder">Hurac�n EVO Spyder</option>
                        <option value="Hurac�n Sterrato">Hurac�n Sterrato</option>
                        <option value="Hurac�n STO">Hurac�n STO</option>
                        <option value="Hurac�n Tecnica">Hurac�n Tecnica</option>
                        <option value="Impreza AWD">Impreza AWD</option>
                        <option value="Integra A-SPEC">Integra A-SPEC</option>
                        <option value="Integra A-SPEC AV7 Z">Integra A-SPEC AV7 Z</option>
                        <option value="Integra A-SPEC M6 Z">Integra A-SPEC M6 Z</option>
                        <option value="Integra Type S">Integra Type S</option>
                        <option value="Integra Type S M6 Z">Integra Type S M6 Z</option>
                        <option value="IS 300 AWD">IS 300 AWD</option>
                        <option value="IS 350 AWD">IS 350 AWD</option>
                        <option value="IS 500">IS 500</option>
                        <option value="Jetta">Jetta</option>
                        <option value="Jetta Comfortline/Highline">Jetta Comfortline/Highline</option>
                        <option value="Jetta GLI">Jetta GLI</option>
                        <option value="John Cooper Works 3 Door">John Cooper Works 3 Door</option>
                        <option value="John Cooper Works Convertible">John Cooper Works Convertible</option>
                        <option value="John Cooper Works Countryman ALL4">John Cooper Works Countryman ALL4</option>
                        <option value="K5">K5</option>
                        <option value="K5 AWD">K5 AWD</option>
                        <option value="Kicks">Kicks</option>
                        <option value="Kona">Kona</option>
                        <option value="Kona (Stop/Start)">Kona (Stop/Start)</option>
                        <option value="Kona AWD">Kona AWD</option>
                        <option value="Kona AWD (Stop/Start)">Kona AWD (Stop/Start)</option>
                        <option value="Land Cruiser">Land Cruiser</option>
                        <option value="LC 500">LC 500</option>
                        <option value="LC 500 Convertible">LC 500 Convertible</option>
                        <option value="LC 500h">LC 500h</option>
                        <option value="Legacy AWD">Legacy AWD</option>
                        <option value="Levante GT">Levante GT</option>
                        <option value="Levante Modena">Levante Modena</option>
                        <option value="Levante Modena V8">Levante Modena V8</option>
                        <option value="Levante Trofeo">Levante Trofeo</option>
                        <option value="LS 500 AWD">LS 500 AWD</option>
                        <option value="LS 500h AWD">LS 500h AWD</option>
                        <option value="LX 600">LX 600</option>
                        <option value="M2 Coupe">M2 Coupe</option>
                        <option value="M240i xDrive Coupe">M240i xDrive Coupe</option>
                        <option value="M3 Competition M xDrive Sedan">M3 Competition M xDrive Sedan</option>
                        <option value="M3 CS Sedan">M3 CS Sedan</option>
                        <option value="M3 Sedan">M3 Sedan</option>
                        <option value="M340i xDrive Sedan">M340i xDrive Sedan</option>
                        <option value="M4 Competition M xDrive Cabriolet">M4 Competition M xDrive Cabriolet</option>
                        <option value="M4 Competition M xDrive Coupe">M4 Competition M xDrive Coupe</option>
                        <option value="M4 Coupe">M4 Coupe</option>
                        <option value="M440i xDrive Cabriolet">M440i xDrive Cabriolet</option>
                        <option value="M440i xDrive Coupe">M440i xDrive Coupe</option>
                        <option value="M8 Competition Cabriolet">M8 Competition Cabriolet</option>
                        <option value="M8 Competition Coupe">M8 Competition Coupe</option>
                        <option value="M8 Competition Gran Coupe">M8 Competition Gran Coupe</option>
                        <option value="M850i xDrive Cabriolet">M850i xDrive Cabriolet</option>
                        <option value="M850i xDrive Coupe">M850i xDrive Coupe</option>
                        <option value="M850i xDrive Gran Coupe">M850i xDrive Gran Coupe</option>
                        <option value="Macan">Macan</option>
                        <option value="Macan GTS">Macan GTS</option>
                        <option value="Macan S">Macan S</option>
                        <option value="Macan T">Macan T</option>
                        <option value="Malibu">Malibu</option>
                        <option value="Maverick AWD">Maverick AWD</option>
                        <option value="Maverick Hybrid">Maverick Hybrid</option>
                        <option value="Maverick Tremor AWD">Maverick Tremor AWD</option>
                        <option value="Maybach S 580 4MATIC Sedan">Maybach S 580 4MATIC Sedan</option>
                        <option value="Maybach S 680 4MATIC Sedan">Maybach S 680 4MATIC Sedan</option>
                        <option value="Mazda3 4-Door">Mazda3 4-Door</option>
                        <option value="Mazda3 4-Door 4WD">Mazda3 4-Door 4WD</option>
                        <option value="Mazda3 4-Door Turbo 4WD">Mazda3 4-Door Turbo 4WD</option>
                        <option value="Mazda3 5-Door">Mazda3 5-Door</option>
                        <option value="Mazda3 5-Door (SIL)">Mazda3 5-Door (SIL)</option>
                        <option value="Mazda3 5-Door 4WD">Mazda3 5-Door 4WD</option>
                        <option value="Mazda3 5-Door Turbo 4WD">Mazda3 5-Door Turbo 4WD</option>
                        <option value="MC20">MC20</option>
                        <option value="MC20 Spyder">MC20 Spyder</option>
                        <option value="MDX SH-AWD">MDX SH-AWD</option>
                        <option value="MDX SH-AWD Type S">MDX SH-AWD Type S</option>
                        <option value="Mirage">Mirage</option>
                        <option value="Model">Model</option>
                        <option value="Murano AWD">Murano AWD</option>
                        <option value="Mustang">Mustang</option>
                        <option value="Mustang (Performance Pack)">Mustang (Performance Pack)</option>
                        <option value="Mustang (Stop-Start)">Mustang (Stop-Start)</option>
                        <option value="Mustang Dark Horse">Mustang Dark Horse</option>
                        <option value="MX-5">MX-5</option>
                        <option value="MX-5 (SIL)">MX-5 (SIL)</option>
                        <option value="Nautilus AWD">Nautilus AWD</option>
                        <option value="Nautilus Hybrid AWD">Nautilus Hybrid AWD</option>
                        <option value="Navigator 4WD">Navigator 4WD</option>
                        <option value="Niro">Niro</option>
                        <option value="Niro FE">Niro FE</option>
                        <option value="NX 250 AWD">NX 250 AWD</option>
                        <option value="NX 350 AWD">NX 350 AWD</option>
                        <option value="NX 350 AWD F SPORT">NX 350 AWD F SPORT</option>
                        <option value="NX 350h AWD">NX 350h AWD</option>
                        <option value="Odyssey">Odyssey</option>
                        <option value="Outback AWD">Outback AWD</option>
                        <option value="Outback Wilderness AWD">Outback Wilderness AWD</option>
                        <option value="Outlander 4WD">Outlander 4WD</option>
                        <option value="Pacifica">Pacifica</option>
                        <option value="Pacifica AWD">Pacifica AWD</option>
                        <option value="Palisade AWD">Palisade AWD</option>
                        <option value="Pathfinder 4WD">Pathfinder 4WD</option>
                        <option value="Pathfinder 4WD Rock Creek">Pathfinder 4WD Rock Creek</option>
                        <option value="Phantom">Phantom</option>
                        <option value="Phantom Extended">Phantom Extended</option>
                        <option value="Pilot AWD">Pilot AWD</option>
                        <option value="Pilot AWD Touring/Elite/Black">Pilot AWD Touring/Elite/Black</option>
                        <option value="Pilot AWD TrailSport">Pilot AWD TrailSport</option>
                        <option value="Prius AWD">Prius AWD</option>
                        <option value="Purosangue">Purosangue</option>
                        <option value="Q3 40 TFSI quattro">Q3 40 TFSI quattro</option>
                        <option value="Q3 45 TFSI quattro">Q3 45 TFSI quattro</option>
                        <option value="Q5 40 TFSI quattro">Q5 40 TFSI quattro</option>
                        <option value="Q5 45 TFSI quattro">Q5 45 TFSI quattro</option>
                        <option value="Q5 Sportback 45 TFSI quattro">Q5 Sportback 45 TFSI quattro</option>
                        <option value="Q50 AWD">Q50 AWD</option>
                        <option value="Q50 AWD Red Sport">Q50 AWD Red Sport</option>
                        <option value="Q7 45 TFSI quattro">Q7 45 TFSI quattro</option>
                        <option value="Q7 55 TFSI quattro">Q7 55 TFSI quattro</option>
                        <option value="Q8 55 TFSI quattro">Q8 55 TFSI quattro</option>
                        <option value="Quattroporte GT">Quattroporte GT</option>
                        <option value="Quattroporte Modena">Quattroporte Modena</option>
                        <option value="Quattroporte Modena AWD">Quattroporte Modena AWD</option>
                        <option value="Quattroporte Trofeo">Quattroporte Trofeo</option>
                        <option value="QX50 AWD">QX50 AWD</option>
                        <option value="QX55 AWD">QX55 AWD</option>
                        <option value="QX60 AWD">QX60 AWD</option>
                        <option value="QX80 4WD">QX80 4WD</option>
                        <option value="Range Rover Evoque P250">Range Rover Evoque P250</option>
                        <option value="Range Rover Velar P250">Range Rover Velar P250</option>
                        <option value="Range Rover Velar P340">Range Rover Velar P340</option>
                        <option value="Range Rover Velar P400">Range Rover Velar P400</option>
                        <option value="Ranger 4WD">Ranger 4WD</option>
                        <option value="Ranger Raptor 4WD">Ranger Raptor 4WD</option>
                        <option value="RAV4 AWD">RAV4 AWD</option>
                        <option value="RAV4 AWD (Stop/Start)">RAV4 AWD (Stop/Start)</option>
                        <option value="RAV4 AWD LE">RAV4 AWD LE</option>
                        <option value="RAV4 Hybrid AWD">RAV4 Hybrid AWD</option>
                        <option value="RAV4 Hybrid AWD Woodland Edition">RAV4 Hybrid AWD Woodland Edition</option>
                        <option value="RC 300 AWD">RC 300 AWD</option>
                        <option value="RC 350 AWD">RC 350 AWD</option>
                        <option value="RC F">RC F</option>
                        <option value="RDX SH-AWD">RDX SH-AWD</option>
                        <option value="RDX SH-AWD A-SPEC">RDX SH-AWD A-SPEC</option>
                        <option value="Rogue">Rogue</option>
                        <option value="Rogue AWD">Rogue AWD</option>
                        <option value="Rogue AWD SL/Platinum">Rogue AWD SL/Platinum</option>
                        <option value="Roma">Roma</option>
                        <option value="Roma Spider">Roma Spider</option>
                        <option value="RS 5 Coup�">RS 5 Coup�</option>
                        <option value="RS 5 Sportback">RS 5 Sportback</option>
                        <option value="RS 6 Avant performance">RS 6 Avant performance</option>
                        <option value="RS 7 Sportback performance">RS 7 Sportback performance</option>
                        <option value="RS Q8">RS Q8</option>
                        <option value="RVR">RVR</option>
                        <option value="RVR 4WD">RVR 4WD</option>
                        <option value="RX 350 AWD">RX 350 AWD</option>
                        <option value="RX 350h AWD">RX 350h AWD</option>
                        <option value="RX 500h AWD">RX 500h AWD</option>
                        <option value="S 500 4MATIC Sedan">S 500 4MATIC Sedan</option>
                        <option value="S 580 4MATIC Sedan">S 580 4MATIC Sedan</option>
                        <option value="S3 quattro">S3 quattro</option>
                        <option value="S4 quattro">S4 quattro</option>
                        <option value="S5 Cabriolet quattro">S5 Cabriolet quattro</option>
                        <option value="S5 Coup� quattro">S5 Coup� quattro</option>
                        <option value="S5 Sportback quattro">S5 Sportback quattro</option>
                        <option value="S6 quattro">S6 quattro</option>
                        <option value="S60 B5 AWD">S60 B5 AWD</option>
                        <option value="S7 quattro">S7 quattro</option>
                        <option value="S8 quattro">S8 quattro</option>
                        <option value="S90 B6 AWD">S90 B6 AWD</option>
                        <option value="Santa Cruz AWD">Santa Cruz AWD</option>
                        <option value="Santa Fe AWD">Santa Fe AWD</option>
                        <option value="Santa Fe AWD XRT">Santa Fe AWD XRT</option>
                        <option value="Santa Fe Hybrid AWD">Santa Fe Hybrid AWD</option>
                        <option value="Seltos">Seltos</option>
                        <option value="Seltos AWD">Seltos AWD</option>
                        <option value="Sentra">Sentra</option>
                        <option value="Sentra SR">Sentra SR</option>
                        <option value="Sequoia 4WD">Sequoia 4WD</option>
                        <option value="Sienna">Sienna</option>
                        <option value="Sienna AWD">Sienna AWD</option>
                        <option value="Sierra">Sierra</option>
                        <option value="Sierra (With Sport Mode)">Sierra (With Sport Mode)</option>
                        <option value="Sierra 4WD">Sierra 4WD</option>
                        <option value="Sierra 4WD (With Sport Mode)">Sierra 4WD (With Sport Mode)</option>
                        <option value="Sierra 4WD AT4X">Sierra 4WD AT4X</option>
                        <option value="Sierra 4WD FFV">Sierra 4WD FFV</option>
                        <option value="Sierra 4WD Mud Terrain Tire">Sierra 4WD Mud Terrain Tire</option>
                        <option value="Sierra 4WD Mud Terrain Tire FFV">Sierra 4WD Mud Terrain Tire FFV</option>
                        <option value="Sierra FFV">Sierra FFV</option>
                        <option value="Silverado">Silverado</option>
                        <option value="Silverado (With Sport Mode)">Silverado (With Sport Mode)</option>
                        <option value="Silverado 4WD">Silverado 4WD</option>
                        <option value="Silverado 4WD (With Sport Mode)">Silverado 4WD (With Sport Mode)</option>
                        <option value="Silverado 4WD FFV">Silverado 4WD FFV</option>
                        <option value="Silverado 4WD Mud Terrain Tire">Silverado 4WD Mud Terrain Tire</option>
                        <option value="Silverado 4WD Mud Terrain Tire (With Sport Mode)">Silverado 4WD Mud Terrain Tire (With Sport Mode)</option>
                        <option value="Silverado 4WD Mud Terrain Tire FFV">Silverado 4WD Mud Terrain Tire FFV</option>
                        <option value="Silverado 4WD ZR2">Silverado 4WD ZR2</option>
                        <option value="Silverado FFV">Silverado FFV</option>
                        <option value="Sonata">Sonata</option>
                        <option value="Sonata AWD">Sonata AWD</option>
                        <option value="Sonata Hybrid">Sonata Hybrid</option>
                        <option value="Sorento AWD">Sorento AWD</option>
                        <option value="Sorento Hybrid AWD">Sorento Hybrid AWD</option>
                        <option value="Soul">Soul</option>
                        <option value="Sportage">Sportage</option>
                        <option value="Sportage AWD">Sportage AWD</option>
                        <option value="Sportage Hybrid AWD">Sportage Hybrid AWD</option>
                        <option value="SQ5 quattro">SQ5 quattro</option>
                        <option value="SQ5 Sportback quattro">SQ5 Sportback quattro</option>
                        <option value="SQ7 quattro">SQ7 quattro</option>
                        <option value="SQ8 quattro">SQ8 quattro</option>
                        <option value="Stelvio">Stelvio</option>
                        <option value="Stelvio AWD">Stelvio AWD</option>
                        <option value="Stelvio AWD Quadrifoglio">Stelvio AWD Quadrifoglio</option>
                        <option value="Suburban">Suburban</option>
                        <option value="Suburban 4WD">Suburban 4WD</option>
                        <option value="Tacoma 4WD">Tacoma 4WD</option>
                        <option value="Tacoma 4WD (2-mode)">Tacoma 4WD (2-mode)</option>
                        <option value="Tacoma 4WD (3-mode)">Tacoma 4WD (3-mode)</option>
                        <option value="Tacoma Hybrid 4WD">Tacoma Hybrid 4WD</option>
                        <option value="Tacoma Hybrid 4WD Limited">Tacoma Hybrid 4WD Limited</option>
                        <option value="Tahoe">Tahoe</option>
                        <option value="Tahoe 4WD">Tahoe 4WD</option>
                        <option value="Taos">Taos</option>
                        <option value="Taos 4MOTION">Taos 4MOTION</option>
                        <option value="Telluride AWD">Telluride AWD</option>
                        <option value="Terrain">Terrain</option>
                        <option value="Terrain AWD">Terrain AWD</option>
                        <option value="Tiguan 4MOTION">Tiguan 4MOTION</option>
                        <option value="Tiguan R-Line 4MOTION">Tiguan R-Line 4MOTION</option>
                        <option value="Tonale AWD">Tonale AWD</option>
                        <option value="Trailblazer">Trailblazer</option>
                        <option value="Trailblazer AWD">Trailblazer AWD</option>
                        <option value="Traverse AWD">Traverse AWD</option>
                        <option value="Traverse Limited AWD">Traverse Limited AWD</option>
                        <option value="Trax">Trax</option>
                        <option value="Tucson AWD">Tucson AWD</option>
                        <option value="Tucson Hybrid">Tucson Hybrid</option>
                        <option value="Tundra">Tundra</option>
                        <option value="Tundra 4WD">Tundra 4WD</option>
                        <option value="Tundra 4WD TRD">Tundra 4WD TRD</option>
                        <option value="Tundra Hybrid 4WD">Tundra Hybrid 4WD</option>
                        <option value="Tundra Hybrid 4WD TRD PRO">Tundra Hybrid 4WD TRD PRO</option>
                        <option value="TX 350 AWD">TX 350 AWD</option>
                        <option value="TX 500h AWD">TX 500h AWD</option>
                        <option value="Urus Performante">Urus Performante</option>
                        <option value="Urus S">Urus S</option>
                        <option value="UX 250h AWD">UX 250h AWD</option>
                        <option value="V60 CC B5 AWD">V60 CC B5 AWD</option>
                        <option value="V90 CC B6 AWD">V90 CC B6 AWD</option>
                        <option value="Valour">Valour</option>
                        <option value="Venue">Venue</option>
                        <option value="Venza AWD">Venza AWD</option>
                        <option value="Versa">Versa</option>
                        <option value="Wagoneer 4X4">Wagoneer 4X4</option>
                        <option value="Wagoneer L 4X4">Wagoneer L 4X4</option>
                        <option value="Wrangler JL 4X4">Wrangler JL 4X4</option>
                        <option value="Wrangler JL 4X4 Rubicon">Wrangler JL 4X4 Rubicon</option>
                        <option value="Wrangler JL Unlimited 4X4">Wrangler JL Unlimited 4X4</option>
                        <option value="Wrangler JL Unlimited 4X4 392">Wrangler JL Unlimited 4X4 392</option>
                        <option value="Wrangler JL Unlimited 4X4 Rubicon">Wrangler JL Unlimited 4X4 Rubicon</option>
                        <option value="WRX AWD">WRX AWD</option>
                        <option value="X1 M35i xDrive">X1 M35i xDrive</option>
                        <option value="X1 xDrive28i">X1 xDrive28i</option>
                        <option value="X2 M35i xDrive">X2 M35i xDrive</option>
                        <option value="X2 xDrive28i">X2 xDrive28i</option>
                        <option value="X3 M">X3 M</option>
                        <option value="X3 M Competition">X3 M Competition</option>
                        <option value="X3 M40i">X3 M40i</option>
                        <option value="X3 xDrive30i">X3 xDrive30i</option>
                        <option value="X4 M">X4 M</option>
                        <option value="X4 M Competition">X4 M Competition</option>
                        <option value="X4 M40i">X4 M40i</option>
                        <option value="X4 xDrive30i">X4 xDrive30i</option>
                        <option value="X5 M Competition">X5 M Competition</option>
                        <option value="X5 M60i">X5 M60i</option>
                        <option value="X5 xDrive40i">X5 xDrive40i</option>
                        <option value="X6 M Competition">X6 M Competition</option>
                        <option value="X6 M60i">X6 M60i</option>
                        <option value="X6 xDrive40i">X6 xDrive40i</option>
                        <option value="X7 M60i">X7 M60i</option>
                        <option value="X7 xDrive40i">X7 xDrive40i</option>
                        <option value="XC40 B5 AWD">XC40 B5 AWD</option>
                        <option value="XC60 B5 AWD">XC60 B5 AWD</option>
                        <option value="XC90 B6 AWD">XC90 B6 AWD</option>
                        <option value="XF P250">XF P250</option>
                        <option value="XF P300 AWD">XF P300 AWD</option>
                        <option value="XT4">XT4</option>
                        <option value="XT4 AWD">XT4 AWD</option>
                        <option value="XT5">XT5</option>
                        <option value="XT5 AWD">XT5 AWD</option>
                        <option value="XT6 AWD">XT6 AWD</option>
                        <option value="Yukon">Yukon</option>
                        <option value="Yukon 4WD">Yukon 4WD</option>
                        <option value="Yukon XL">Yukon XL</option>
                        <option value="Yukon XL 4WD">Yukon XL 4WD</option>
                        <option value="Z">Z</option>
                        <option value="Z NISMO">Z NISMO</option>
                        <option value="Z4 M40i">Z4 M40i</option>
                        <option value="Z4 sDrive30i">Z4 sDrive30i</option>
                        {options.model.map(model => (
                            <option key={model} value={model}>{model}</option>
                        ))}
                    </select>

                    <select name="vehicleClass" value={filters.vehicleClass} onChange={handleChange}>
                        <option value="">Select Vehicle Class</option>
                        <option value="Compact">Compact</option>
                        <option value="Full-size">Full-size</option>
                        <option value="Mid-size">Mid-size</option>
                        <option value="Minicompact">Minicompact</option>
                        <option value="Minivan">Minivan</option>
                        <option value="Pickup truck: Small">Pickup truck: Small</option>
                        <option value="Pickup truck: Standard">Pickup truck: Standard</option>
                        <option value="Sport utility vehicle: Small">Sport utility vehicle: Small</option>
                        <option value="Sport utility vehicle: Standard">Sport utility vehicle: Standard</option>
                        <option value="Station wagon: Mid-size">Station wagon: Mid-size</option>
                        <option value="Station wagon: Small">Station wagon: Small</option>
                        <option value="Subcompact">Subcompact</option>
                        <option value="Two-seater">Two-seater</option>
                        {options.vehicleClass.map(vClass => (
                            <option key={vClass} value={vClass}>{vClass}</option>
                        ))}
                    </select>
                    <button onClick={handleAddVehicle}>Add Vehicle</button>
                </div>

                <div>
                    <h3>Vehicles:</h3>
                    <ul>
                        {selectedVehicles.map((vehicle, index) => (
                            <li key={index}>
                                {vehicle.modelYear} {vehicle.make} {vehicle.model} ({vehicle.vehicleClass})
                                <button type="button" onClick={() => handleRemoveVehicle(index)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                    <button onClick={handleCompare} disabled={selectedVehicles.length < 2}>Compare Vehicles</button>
                </div>
                
                <button type="submit">Apply Filters</button>
                <button type="button" onClick={resetFilters}>Reset Filters</button>
            </div>
        </form>
    );
};

export default FilterPanel;
